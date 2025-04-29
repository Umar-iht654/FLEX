from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import mysql.connector
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

app = Flask(__name__)
CORS(app)

db_config = {
    'host': 'studdb.csc.liv.ac.uk',
    'user': 'sgbadede',
    'password': 'TempasBas',
    'database': 'sgbadede'
}

Base = declarative_base()

# Association table for group members
group_members = Table(
    "group_members",
    Base.metadata,
    Column("group_id", Integer, ForeignKey("groups.id")),
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("role", String, default="member")  # member, admin, etc.
)

class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    bio = Column(String)
    activity_type = Column(String)
    member_count = Column(Integer, default=0)
    is_private = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    creator = relationship("User")
    members = relationship("User", secondary=group_members, back_populates="groups")
    messages = relationship("Message", back_populates="group")

class GroupMember(BaseModel):
    user_id: int

class GroupBase(BaseModel):
    name: str
    bio: Optional[str] = None
    activity_type: str

class GroupCreate(GroupBase):
    users: List[GroupMember]

class GroupUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    activity_type: Optional[str] = None
    is_private: Optional[bool] = None

class GroupResponse(GroupBase):
    id: int
    created_by: int
    member_count: int
    created_at: datetime
    updated_at: datetime
    users: List[GroupMember]

    class Config:
        from_attributes = True

class GroupList(BaseModel):
    groups: List[GroupResponse]
    total: int
    page: int
    size: int

class GroupNotFoundError(Exception):
    pass

class UnauthorizedAccessError(Exception):
    pass

def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn

@app.route('/groups', methods=['GET'])
def get_groups():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM groups")
        groups = cursor.fetchall()
        
        # For each group, get the members
        for group in groups:
            cursor.execute("""
                SELECT u.id, u.username, gm.role 
                FROM users u
                JOIN group_members gm ON u.id = gm.user_id
                WHERE gm.group_id = %s
            """, (group['id'],))
            group['members'] = cursor.fetchall()
            
        cursor.close()
        conn.close()
        
        return jsonify({"groups": groups, "total": len(groups), "page": 1, "size": len(groups)})
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/groups/<int:group_id>', methods=['GET'])
def get_group(group_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM groups WHERE id = %s", (group_id,))
        group = cursor.fetchone()
        
        if not group:
            cursor.close()
            conn.close()
            return jsonify({"detail": "Group not found"}), 404
            
        # Get group members
        cursor.execute("""
            SELECT u.id, u.username, gm.role 
            FROM users u
            JOIN group_members gm ON u.id = gm.user_id
            WHERE gm.group_id = %s
        """, (group_id,))
        group['members'] = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(group)
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/groups', methods=['POST'])
def create_group():
    data = GroupCreate(**request.json)
    creator_id = request.json.get('creator_id')
    
    if not creator_id:
        return jsonify({"detail": "Creator ID is required"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Create the group
        cursor.execute("""
            INSERT INTO groups (name, bio, activity_type, member_count, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data.name,
            data.bio,
            data.activity_type,
            len(data.users),  # Initial member count
            datetime.utcnow(),
            datetime.utcnow()
        ))
        group_id = cursor.lastrowid
        conn.commit()
        
        # Add members to the group
        for member in data.users:
            cursor.execute("""
                INSERT INTO group_members (group_id, user_id, role)
                VALUES (%s, %s, %s)
            """, (
                group_id,
                member.user_id,
                "admin" if member.user_id == creator_id else "member"
            ))
        conn.commit()
        
        # Fetch the created group
        cursor.execute("SELECT * FROM groups WHERE id = %s", (group_id,))
        group = cursor.fetchone()
        
        # Get group members
        cursor.execute("""
            SELECT u.id, u.username, gm.role 
            FROM users u
            JOIN group_members gm ON u.id = gm.user_id
            WHERE gm.group_id = %s
        """, (group_id,))
        group['members'] = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(group), 201
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/groups/<int:group_id>', methods=['PUT'])
def update_group(group_id):
    data = GroupUpdate(**request.json)
    user_id = request.json.get('user_id')
    
    if not user_id:
        return jsonify({"detail": "User ID is required"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check if user is admin of the group
        cursor.execute("""
            SELECT * FROM group_members 
            WHERE group_id = %s AND user_id = %s AND role = 'admin'
        """, (group_id, user_id))
        
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"detail": "Unauthorized: only group admins can update group details"}), 403
        
        # Build update query dynamically based on what fields are provided
        update_fields = []
        params = []
        
        if data.name is not None:
            update_fields.append("name = %s")
            params.append(data.name)
            
        if data.bio is not None:
            update_fields.append("bio = %s")
            params.append(data.bio)
            
        if data.activity_type is not None:
            update_fields.append("activity_type = %s")
            params.append(data.activity_type)
            
        if data.is_private is not None:
            update_fields.append("is_private = %s")
            params.append(data.is_private)
            
        update_fields.append("updated_at = %s")
        params.append(datetime.utcnow())
        
        # Add group_id to params
        params.append(group_id)
        
        # Execute update
        query = f"UPDATE groups SET {', '.join(update_fields)} WHERE id = %s"
        cursor.execute(query, params)
        conn.commit()
        
        # Fetch updated group
        cursor.execute("SELECT * FROM groups WHERE id = %s", (group_id,))
        group = cursor.fetchone()
        
        # Get group members
        cursor.execute("""
            SELECT u.id, u.username, gm.role 
            FROM users u
            JOIN group_members gm ON u.id = gm.user_id
            WHERE gm.group_id = %s
        """, (group_id,))
        group['members'] = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(group)
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/groups/<int:group_id>', methods=['DELETE'])
def delete_group(group_id):
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({"detail": "User ID is required"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if user is admin of the group
        cursor.execute("""
            SELECT * FROM group_members 
            WHERE group_id = %s AND user_id = %s AND role = 'admin'
        """, (group_id, user_id))
        
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"detail": "Unauthorized: only group admins can delete the group"}), 403
        
        # Delete group members first (due to foreign key constraints)
        cursor.execute("DELETE FROM group_members WHERE group_id = %s", (group_id,))
        
        # Delete the group
        cursor.execute("DELETE FROM groups WHERE id = %s", (group_id,))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({"detail": "Group deleted successfully"})
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/groups/<int:group_id>/members', methods=['POST'])
def add_member(group_id):
    member_data = GroupMember(**request.json)
    admin_id = request.json.get('admin_id')
    
    if not admin_id:
        return jsonify({"detail": "Admin ID is required"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check if user is admin of the group
        cursor.execute("""
            SELECT * FROM group_members 
            WHERE group_id = %s AND user_id = %s AND role = 'admin'
        """, (group_id, admin_id))
        
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"detail": "Unauthorized: only group admins can add members"}), 403
        
        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE id = %s", (member_data.user_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"detail": "User not found"}), 404
            
        # Check if user is already a member
        cursor.execute("""
            SELECT * FROM group_members 
            WHERE group_id = %s AND user_id = %s
        """, (group_id, member_data.user_id))
        
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"detail": "User is already a member of this group"}), 400
        
        # Add member to the group
        cursor.execute("""
            INSERT INTO group_members (group_id, user_id, role)
            VALUES (%s, %s, %s)
        """, (
            group_id,
            member_data.user_id,
            "member"
        ))
        
        # Update member count
        cursor.execute("""
            UPDATE groups 
            SET member_count = member_count + 1,
                updated_at = %s
            WHERE id = %s
        """, (datetime.utcnow(), group_id))
        
        conn.commit()
        
        # Get group member info
        cursor.execute("""
            SELECT u.id, u.username, gm.role 
            FROM users u
            JOIN group_members gm ON u.id = gm.user_id
            WHERE gm.group_id = %s AND u.id = %s
        """, (group_id, member_data.user_id))
        
        member = cursor.fetchone()
        cursor.close()
        conn.close()
        
        return jsonify(member), 201
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/groups/<int:group_id>/members/<int:user_id>', methods=['DELETE'])
def remove_member(group_id, user_id):
    admin_id = request.args.get('admin_id')
    
    if not admin_id:
        return jsonify({"detail": "Admin ID is required"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if user is admin of the group or removing themselves
        cursor.execute("""
            SELECT * FROM group_members 
            WHERE group_id = %s AND ((user_id = %s AND role = 'admin') OR user_id = %s)
        """, (group_id, admin_id, user_id))
        
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"detail": "Unauthorized: only group admins can remove members"}), 403
        
        # Remove member from the group
        cursor.execute("""
            DELETE FROM group_members 
            WHERE group_id = %s AND user_id = %s
        """, (group_id, user_id))
        
        if cursor.rowcount > 0:
            # Update member count
            cursor.execute("""
                UPDATE groups 
                SET member_count = member_count - 1,
                    updated_at = %s
                WHERE id = %s
            """, (datetime.utcnow(), group_id))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return jsonify({"detail": "Member removed successfully"})
        else:
            cursor.close()
            conn.close()
            return jsonify({"detail": "User is not a member of this group"}), 404
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/user/<int:user_id>/groups', methods=['GET'])
def get_user_groups(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT g.* 
            FROM groups g
            JOIN group_members gm ON g.id = gm.group_id
            WHERE gm.user_id = %s
        """, (user_id,))
        
        groups = cursor.fetchall()
        
        # For each group, get the members
        for group in groups:
            cursor.execute("""
                SELECT u.id, u.username, gm.role 
                FROM users u
                JOIN group_members gm ON u.id = gm.user_id
                WHERE gm.group_id = %s
            """, (group['id'],))
            group['members'] = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({"groups": groups, "total": len(groups), "page": 1, "size": len(groups)})
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

if __name__ == '__main__':
    app.run(debug=True) 
    
