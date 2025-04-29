from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import mysql.connector
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship, Session
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

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    sender_id = Column(Integer, ForeignKey("users.id"))
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=True)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_read = Column(Boolean, default=False)
    is_pinned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    sender = relationship("User", back_populates="messages", foreign_keys=[sender_id])
    group = relationship("Group", back_populates="messages")
    recipient = relationship("User", foreign_keys=[recipient_id])

class MessageBase(BaseModel):
    content: str
    group_id: Optional[int] = None
    recipient_id: Optional[int] = None

class MessageCreate(MessageBase):
    pass

class MessageUpdate(BaseModel):
    content: Optional[str] = None
    is_read: Optional[bool] = None
    is_pinned: Optional[bool] = None

class MessageResponse(MessageBase):
    id: int
    sender_id: int
    is_read: bool
    is_pinned: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Conversation(BaseModel):
    messages: List[MessageResponse]
    other_user_id: int
    other_user_name: str

class MessageList(BaseModel):
    messages: list[MessageResponse]
    total: int
    page: int
    size: int

class UserNotFoundError(Exception):
    pass

class UnauthorizedAccessError(Exception):
    pass

def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn

@app.route('/')
def home():
    return 'Welcome to the Messaging API!'

@app.route('/messages/<int:user_id>', methods=['GET'])
def get_user_messages(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM messages 
            WHERE sender_id = %s OR recipient_id = %s
        """, (user_id, user_id))
        messages = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({"messages": messages})
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/conversations/<int:user_id>/<int:other_user_id>', methods=['GET'])
def get_conversation(user_id, other_user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM messages 
            WHERE (sender_id = %s AND recipient_id = %s) 
            OR (sender_id = %s AND recipient_id = %s)
            ORDER BY created_at
        """, (user_id, other_user_id, other_user_id, user_id))
        messages = cursor.fetchall()
        
        # Get other user's name
        cursor.execute("SELECT * FROM users WHERE id = %s", (other_user_id,))
        other_user = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if not other_user:
            return jsonify({"detail": "User not found"}), 404
            
        return jsonify({
            "messages": messages,
            "other_user_id": other_user_id,
            "other_user_name": other_user.get("name", "Unknown")
        })
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/messages', methods=['POST'])
def send_message():
    data = MessageCreate(**request.json)
    sender_id = request.json.get('sender_id')
    
    if not sender_id:
        return jsonify({"detail": "Sender ID is required"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Verify recipient exists if specified
        if data.recipient_id:
            cursor.execute("SELECT * FROM users WHERE id = %s", (data.recipient_id,))
            if not cursor.fetchone():
                cursor.close()
                conn.close()
                return jsonify({"detail": "Recipient not found"}), 404
        
        # Insert the message
        cursor.execute("""
            INSERT INTO messages (content, sender_id, group_id, recipient_id, is_read, is_pinned, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data.content,
            sender_id,
            data.group_id,
            data.recipient_id,
            False,  # is_read
            False,  # is_pinned
            datetime.utcnow(),
            datetime.utcnow()
        ))
        message_id = cursor.lastrowid
        conn.commit()
        
        # Fetch the created message
        cursor.execute("SELECT * FROM messages WHERE id = %s", (message_id,))
        message = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return jsonify(message), 201
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/messages/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"detail": "User ID is required"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if message exists and user has permission
        cursor.execute("""
            SELECT * FROM messages 
            WHERE id = %s AND (sender_id = %s OR recipient_id = %s)
        """, (message_id, user_id, user_id))
        
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"detail": "Message not found or unauthorized"}), 404
        
        # Delete the message
        cursor.execute("DELETE FROM messages WHERE id = %s", (message_id,))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({"detail": "Message deleted successfully"})
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/messages/<int:message_id>', methods=['GET'])
def get_message_by_id(message_id):
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"detail": "User ID is required"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT * FROM messages 
            WHERE id = %s AND (sender_id = %s OR recipient_id = %s)
        """, (message_id, user_id, user_id))
        
        message = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not message:
            return jsonify({"detail": "Message not found or unauthorized"}), 404
            
        return jsonify(message)
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

@app.route('/messages/<int:message_id>', methods=['PUT'])
def update_message(message_id):
    data = MessageUpdate(**request.json)
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({"detail": "User ID is required"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check if message exists and user has permission
        cursor.execute("""
            SELECT * FROM messages 
            WHERE id = %s AND sender_id = %s
        """, (message_id, user_id))
        
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"detail": "Message not found or unauthorized"}), 404
        
        # Build update query dynamically based on what fields are provided
        update_fields = []
        params = []
        
        if data.content is not None:
            update_fields.append("content = %s")
            params.append(data.content)
            
        if data.is_read is not None:
            update_fields.append("is_read = %s")
            params.append(data.is_read)
            
        if data.is_pinned is not None:
            update_fields.append("is_pinned = %s") 
            params.append(data.is_pinned)
            
        update_fields.append("updated_at = %s")
        params.append(datetime.utcnow())
        
        # Add message_id to params
        params.append(message_id)
        
        # Execute update
        query = f"UPDATE messages SET {', '.join(update_fields)} WHERE id = %s"
        cursor.execute(query, params)
        conn.commit()
        
        # Fetch updated message
        cursor.execute("SELECT * FROM messages WHERE id = %s", (message_id,))
        updated_message = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return jsonify(updated_message)
    except mysql.connector.Error as err:
        return jsonify({"detail": "Database error occurred"}), 500

if __name__ == '__main__':
    app.run(debug=True) 