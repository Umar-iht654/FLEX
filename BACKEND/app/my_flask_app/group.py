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
    created_at = Column(DateTime, default=datetime.utcnow)

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
    pass

class GroupUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    activity_type: Optional[str] = None

class GroupResponse(BaseModel):
    id: int
    name: str
    bio: Optional[str] = None
    activity_type: str
    member_count: int
    created_at: datetime

class GroupList(BaseModel):
    groups: List[GroupResponse]
    total: int
    page: int
    size: int

class GroupNotFoundError(Exception):
    pass

class UnauthorizedAccessError(Exception):
    pass

#get_db_connection(): Creates and returns a MySQL database connection using the configured credentials.
def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn


# get_groups(): Returns all groups with their members. Fetches every group from the database and includes member information for each group.
@app.route('/groups', methods=['GET'])
def get_groups():
    """Get all groups"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM `groups`")
        groups = cursor.fetchall()
        
        # For each group, get the members
        for group in groups:
            cursor.execute("""
                SELECT u.id, u.username, u.full_name, gm.role 
                FROM users u
                JOIN group_members gm ON u.id = gm.user_id
                WHERE gm.group_id = %s
            """, (group['id'],))
            group['members'] = cursor.fetchall()
            
        cursor.close()
        conn.close()
        
        return jsonify({"groups": groups, "total": len(groups)})
    except mysql.connector.Error as err:
        return jsonify({"detail": f"Database error: {str(err)}"}), 500

#get_group(group_id): Returns a specific group by ID with all its member information. Returns a 404 error if the group doesn't exist
@app.route('/groups/<int:group_id>', methods=['GET'])
def get_group(group_id):
    """Get a specific group by ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM `groups` WHERE id = %s", (group_id,))
        group = cursor.fetchone()
        
        if not group:
            cursor.close()
            conn.close()
            return jsonify({"detail": "Group not found"}), 404
            
        # Get group members
        cursor.execute("""
            SELECT u.id, u.username, u.full_name, gm.role 
            FROM users u
            JOIN group_members gm ON u.id = gm.user_id
            WHERE gm.group_id = %s
        """, (group_id,))
        group['members'] = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(group)
    except mysql.connector.Error as err:
        return jsonify({"detail": f"Database error: {str(err)}"}), 500
    
.

#create_group(): Creates a new group with the creator as the first admin member. Requires a name, bio, activity type, and creator_id. The creator is automatically added as an admin.
@app.route('/groups', methods=['POST'])
def create_group():
    """Create a new group with creator as admin"""
    data = GroupCreate(**request.json)
    creator_id = request.json.get('creator_id')
    
    if not creator_id:
        return jsonify({"detail": "Creator ID is required"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check if creator exists
        cursor.execute("SELECT id, username FROM users WHERE id = %s", (creator_id,))
        creator = cursor.fetchone()
        
        if not creator:
            cursor.close()
            conn.close()
            return jsonify({"detail": "Creator user not found"}), 404
        
        # Create the group
        now = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute("""
            INSERT INTO `groups` (name, bio, activity_type, member_count, created_at)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            data.name,
            data.bio,
            data.activity_type,
            1,  # Initial member count (creator)
            now
        ))
        group_id = cursor.lastrowid
        conn.commit()
        
        # Add creator as admin
        cursor.execute("""
            INSERT INTO group_members (group_id, user_id, role)
            VALUES (%s, %s, %s)
        """, (
            group_id,
            creator_id,
            "admin"
        ))
        conn.commit()
        
        # Fetch the created group
        cursor.execute("SELECT * FROM `groups` WHERE id = %s", (group_id,))
        group = cursor.fetchone()
        
        # Get group members (just the creator at this point)
        cursor.execute("""
            SELECT u.id, u.username, u.full_name, gm.role 
            FROM users u
            JOIN group_members gm ON u.id = gm.user_id
            WHERE gm.group_id = %s
        """, (group_id,))
        group['members'] = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(group), 201
    except mysql.connector.Error as err:
        return jsonify({"detail": f"Database error: {str(err)}"}), 500



#update_group(group_id): Allows admins to update a group's name, bio, or activity type. Only group admins can perform this action.
@app.route('/groups/<int:group_id>', methods=['PUT'])
def update_group(group_id):
    """Update group details (admin only)"""
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
            
        if not update_fields:
            cursor.close()
            conn.close()
            return jsonify({"detail": "No fields to update provided"}), 400
            
        # Add group_id to params
        params.append(group_id)
        
        # Execute update
        query = f"UPDATE `groups` SET {', '.join(update_fields)} WHERE id = %s"
        cursor.execute(query, params)
        conn.commit()
        
        # Fetch updated group
        cursor.execute("SELECT * FROM `groups` WHERE id = %s", (group_id,))
        group = cursor.fetchone()
        
        # Get group members
        cursor.execute("""
            SELECT u.id, u.username, u.full_name, gm.role 
            FROM users u
            JOIN group_members gm ON u.id = gm.user_id
            WHERE gm.group_id = %s
        """, (group_id,))
        group['members'] = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(group)
    except mysql.connector.Error as err:
        return jsonify({"detail": f"Database error: {str(err)}"}), 500

#delete_group(group_id): Deletes a group and its associated data (messages, member relationships). Only group admins can delete a group.
@app.route('/groups/<int:group_id>', methods=['DELETE'])
def delete_group(group_id):
    """Delete a group (admin only)"""
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
        
        # Delete group messages first (due to foreign key constraints)
        cursor.execute("DELETE FROM messages WHERE group_id = %s", (group_id,))
        
        # Delete group members (due to foreign key constraints)
        cursor.execute("DELETE FROM group_members WHERE group_id = %s", (group_id,))
        
        # Delete the group
        cursor.execute("DELETE FROM `groups` WHERE id = %s", (group_id,))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({"detail": "Group deleted successfully"})
    except mysql.connector.Error as err:
        return jsonify({"detail": f"Database error: {str(err)}"}), 500

#add_member(group_id): Lets admins add a new member to a group. Verifies the user exists and isn't already a member.
@app.route('/groups/<int:group_id>/members', methods=['POST'])
def add_member(group_id):
    """Add a member to a group (admin only)"""
    user_id = request.json.get('user_id')
    admin_id = request.json.get('admin_id')
    
    if not user_id or not admin_id:
        return jsonify({"detail": "Both user_id and admin_id are required"}), 400
    
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
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"detail": "User not found"}), 404
            
        # Check if user is already a member
        cursor.execute("""
            SELECT * FROM group_members 
            WHERE group_id = %s AND user_id = %s
        """, (group_id, user_id))
        
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
            user_id,
            "member"
        ))
        
        # Update member count
        cursor.execute("""
            UPDATE `groups` 
            SET member_count = member_count + 1
            WHERE id = %s
        """, (group_id,))
        
        conn.commit()
        
        # Get group member info
        cursor.execute("""
            SELECT u.id, u.username, u.full_name, gm.role 
            FROM users u
            JOIN group_members gm ON u.id = gm.user_id
            WHERE gm.group_id = %s AND u.id = %s
        """, (group_id, user_id))
        
        member = cursor.fetchone()
        cursor.close()
        conn.close()
        
        return jsonify(member), 201
    except mysql.connector.Error as err:
        return jsonify({"detail": f"Database error: {str(err)}"}), 500

#remove_member(group_id, user_id): Removes a member from a group. Admins can remove any member, and users can remove themselves. Prevents removing the last admin.
@app.route('/groups/<int:group_id>/members/<int:user_id>', methods=['DELETE'])
def remove_member(group_id, user_id):
    """Remove a member from a group (admin only or self-removal)"""
    admin_id = request.args.get('admin_id')
    
    if not admin_id:
        return jsonify({"detail": "Admin ID is required"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if user is admin of the group or removing themselves
        is_self_removal = str(admin_id) == str(user_id)
        
        if not is_self_removal:
            cursor.execute("""
                SELECT * FROM group_members 
                WHERE group_id = %s AND user_id = %s AND role = 'admin'
            """, (group_id, admin_id))
            if not cursor.fetchone():
                cursor.close()
                conn.close()
                return jsonify({"detail": "Unauthorized: only group admins can remove other members"}), 403
        
        # Check if the user to remove exists in the group
        cursor.execute("""
            SELECT * FROM group_members 
            WHERE group_id = %s AND user_id = %s
        """, (group_id, user_id))
        
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"detail": "User is not a member of this group"}), 404
            
        # Cannot remove the last admin
        if not is_self_removal:
            cursor.execute("""
                SELECT role FROM group_members 
                WHERE group_id = %s AND user_id = %s
            """, (group_id, user_id))
            member_role = cursor.fetchone()
            
            if member_role and member_role[0] == 'admin':
                # Check if this is the last admin
                cursor.execute("""
                    SELECT COUNT(*) FROM group_members 
                    WHERE group_id = %s AND role = 'admin'
                """, (group_id,))
                admin_count = cursor.fetchone()[0]
                
                if admin_count <= 1:
                    cursor.close()
                    conn.close()
                    return jsonify({"detail": "Cannot remove the last admin of the group"}), 400
        
        # Remove member from the group
        cursor.execute("""
            DELETE FROM group_members 
            WHERE group_id = %s AND user_id = %s
        """, (group_id, user_id))
        
        # Update member count
        cursor.execute("""
            UPDATE `groups` 
            SET member_count = member_count - 1
            WHERE id = %s
        """, (group_id,))
            
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"detail": "Member removed successfully"})
    except mysql.connector.Error as err:
        return jsonify({"detail": f"Database error: {str(err)}"}), 500

#join_group(group_id): Allows a user to join a group without admin approval. Checks if the user exists and isn't already a member.
@app.route('/join-group/<int:group_id>', methods=['POST'])
def join_group(group_id):
    """Allow a user to join a group without admin approval"""
    user_id = request.json.get('user_id')
    
    if not user_id:
        return jsonify({"detail": "User ID is required"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check if group exists
        cursor.execute("SELECT * FROM `groups` WHERE id = %s", (group_id,))
        group = cursor.fetchone()
        
        if not group:
            cursor.close()
            conn.close()
            return jsonify({"detail": "Group not found"}), 404
            
        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"detail": "User not found"}), 404
            
        # Check if user is already a member
        cursor.execute("""
            SELECT * FROM group_members 
            WHERE group_id = %s AND user_id = %s
        """, (group_id, user_id))
        
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"detail": "You are already a member of this group"}), 400
        
        # Add user to the group
        cursor.execute("""
            INSERT INTO group_members (group_id, user_id, role)
            VALUES (%s, %s, %s)
        """, (
            group_id,
            user_id,
            "member"
        ))
        
        # Update member count
        cursor.execute("""
            UPDATE `groups` 
            SET member_count = member_count + 1
            WHERE id = %s
        """, (group_id,))
        
        conn.commit()
        
        # Get updated group
        cursor.execute("SELECT * FROM `groups` WHERE id = %s", (group_id,))
        updated_group = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return jsonify({"detail": "Successfully joined the group", "group": updated_group})
    except mysql.connector.Error as err:
        return jsonify({"detail": f"Database error: {str(err)}"}), 500

#get_user_groups(user_id): Returns all groups that a specific user is a member of, including member information for each group.
@app.route('/user/<int:user_id>/groups', methods=['GET'])
def get_user_groups(user_id):
    """Get all groups a user is a member of"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT g.* 
            FROM `groups` g
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
        
        return jsonify({"groups": groups, "total": len(groups)})
    except mysql.connector.Error as err:
        return jsonify({"detail": f"Database error: {str(err)}"}), 500

if __name__ == '__main__':
    app.run(debug=True) 
    
