from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import mysql.connector

app = Flask(__name__)
CORS(app)

db_config = {
    'host': 'studdb.csc.liv.ac.uk',
    'user': 'sgbadede',
    'password': 'TempasBas',
    'database': 'sgbadede'
}

class MessageBase(BaseModel):
    content: str
    group_id: Optional[int] = None
    recipient_id: Optional[int] = None

class MessageCreate(MessageBase):
    pass

class MessageUpdate(BaseModel):
    content: Optional[str] = None
    is_read: Optional[bool] = None

def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn

@app.route('/')
def home():
    return 'Welcome to the Messaging API!'

@app.route('/messages/<int:user_id>', methods=['GET'])
def get_user_messages(user_id):
    """Get all messages for a user (both direct and group)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get direct messages where user is sender or recipient
        cursor.execute("""
            SELECT m.*, sender.username as sender_name, recipient.username as recipient_name 
            FROM messages m
            JOIN users sender ON m.sender_id = sender.id
            LEFT JOIN users recipient ON m.recipient_id = recipient.id
            WHERE (m.sender_id = %s OR m.recipient_id = %s) AND m.group_id IS NULL
            ORDER BY m.created_at DESC
        """, (user_id, user_id))
        # This query:
        # 1. Retrieves all direct messages where the user is either sender or recipient
        # 2. Joins with users table twice - once for sender info, once for recipient info
        # 3. Uses LEFT JOIN for recipient because in some cases there might not be a recipient
        # 4. Ensures we're only getting direct messages (group_id IS NULL)
        # 5. Orders results by creation time descending (newest first)
        direct_messages = cursor.fetchall()
        
        # Get group messages for groups the user is a member of
        cursor.execute("""
            SELECT m.*, sender.username as sender_name, g.name as group_name
            FROM messages m
            JOIN users sender ON m.sender_id = sender.id
            JOIN `groups` g ON m.group_id = g.id
            JOIN group_members gm ON g.id = gm.group_id
            WHERE gm.user_id = %s
            ORDER BY m.created_at DESC
        """, (user_id,))
        # This query:
        # 1. Retrieves all group messages from groups the user is a member of
        # 2. Joins with users table to get sender information
        # 3. Joins with groups table to get group information
        # 4. Joins with group_members to check if the user is a member of the group
        # 5. Orders results by creation time descending (newest first)
        group_messages = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            "direct_messages": direct_messages,
            "group_messages": group_messages
        })
    except mysql.connector.Error as err:
        return jsonify({"detail": f"Database error: {str(err)}"}), 500

@app.route('/conversations/<int:user_id>/<int:other_user_id>', methods=['GET'])
def get_conversation(user_id, other_user_id):
    """Get direct conversation between two users"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get messages between the two users
        cursor.execute("""
            SELECT m.*, sender.username as sender_name
            FROM messages m
            JOIN users sender ON m.sender_id = sender.id
            WHERE ((m.sender_id = %s AND m.recipient_id = %s) 
                OR (m.sender_id = %s AND m.recipient_id = %s))
                AND m.group_id IS NULL
            ORDER BY m.created_at
        """, (user_id, other_user_id, other_user_id, user_id))
        # This query:
        # 1. Retrieves all direct messages exchanged between two specific users
        # 2. Gets messages sent in both directions (from user1→user2 and user2→user1)
        # 3. Joins with users table to get the sender's username
        # 4. Ensures we're only getting direct messages (group_id IS NULL)
        # 5. Orders results chronologically (oldest first) for conversation display
        messages = cursor.fetchall()
        
        # Get other user details
        cursor.execute("SELECT username FROM users WHERE id = %s", (other_user_id,))
        # This query:
        # 1. Gets the username of the other user in the conversation for display purposes
        other_user = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if not other_user:
            return jsonify({"detail": "User not found"}), 404
            
        return jsonify({
            "messages": messages,
            "other_user_name": other_user['username']
        })
    except mysql.connector.Error as err:
        return jsonify({"detail": f"Database error: {str(err)}"}), 500

@app.route('/group-messages/<int:user_id>/<int:group_id>', methods=['GET'])
def get_group_messages(user_id, group_id):
    """Get messages from a group"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check if user is a member of the group
        cursor.execute("""
            SELECT * FROM group_members
            WHERE group_id = %s AND user_id = %s
        """, (group_id, user_id))
        # This query:
        # 1. Verifies that the user is a member of the group before showing messages
        # 2. Acts as a security check to prevent unauthorized access to group messages
        
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"detail": "You are not a member of this group"}), 403
        
        # Get group messages
        cursor.execute("""
            SELECT m.*, sender.username as sender_name, g.name as group_name
            FROM messages m
            JOIN users sender ON m.sender_id = sender.id
            JOIN `groups` g ON m.group_id = g.id
            WHERE m.group_id = %s
            ORDER BY m.created_at
        """, (group_id,))
        # This query:
        # 1. Retrieves all messages for a specific group
        # 2. Joins with users table to get sender information
        # 3. Joins with groups table to get group name
        # 4. Orders results chronologically (oldest first) for conversation display
        messages = cursor.fetchall()
        
        # Get group info
        cursor.execute("SELECT name FROM `groups` WHERE id = %s", (group_id,))
        # This query:
        # 1. Gets the group name for display purposes
        group = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if not group:
            return jsonify({"detail": "Group not found"}), 404
            
        return jsonify({
            "messages": messages,
            "group_name": group['name']
        })
    except mysql.connector.Error as err:
        return jsonify({"detail": f"Database error: {str(err)}"}), 500

@app.route('/messages', methods=['POST'])
def send_message():
    """Send a message (either direct or to a group)"""
    data = MessageCreate(**request.json)
    sender_id = request.json.get('sender_id')
    
    if not sender_id:
        return jsonify({"detail": "Sender ID is required"}), 400
    
    # Make sure exactly one of recipient_id or group_id is provided
    if (data.recipient_id is None and data.group_id is None) or \
       (data.recipient_id is not None and data.group_id is not None):
        return jsonify({"detail": "Provide either recipient_id or group_id, but not both"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # For direct message, check recipient exists
        if data.recipient_id:
            cursor.execute("SELECT id FROM users WHERE id = %s", (data.recipient_id,))
            # This query:
            # 1. Verifies that the recipient user exists before sending a direct message
            if not cursor.fetchone():
                cursor.close()
                conn.close()
                return jsonify({"detail": "Recipient not found"}), 404
        
        # For group message, check group exists and user is a member
        if data.group_id:
            cursor.execute("""
                SELECT gm.* FROM group_members gm
                WHERE gm.group_id = %s AND gm.user_id = %s
            """, (data.group_id, sender_id))
            # This query:
            # 1. Verifies that the group exists and the sender is a member
            # 2. Acts as a security check to prevent unauthorized messages to groups
            if not cursor.fetchone():
                cursor.close()
                conn.close()
                return jsonify({"detail": "Group not found or you're not a member"}), 403
        
        # Insert the message
        now = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute("""
            INSERT INTO messages 
            (content, sender_id, group_id, recipient_id, is_read, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            data.content,
            sender_id,
            data.group_id,
            data.recipient_id,
            False,
            now,
            now
        ))
        # This query:
        # 1. Inserts a new message into the database
        # 2. Sets either group_id or recipient_id based on message type
        # 3. Sets initial read status to false
        # 4. Sets creation and update timestamps
        
        message_id = cursor.lastrowid
        conn.commit()
        
        # Get the created message
        cursor.execute("""
            SELECT m.*, sender.username as sender_name
            FROM messages m
            JOIN users sender ON m.sender_id = sender.id
            WHERE m.id = %s
        """, (message_id,))
        # This query:
        # 1. Retrieves the newly created message with sender information
        # 2. Used to return the complete message object in the response
        message = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return jsonify(message), 201
    except mysql.connector.Error as err:
        return jsonify({"detail": f"Database error: {str(err)}"}), 500

@app.route('/messages/<int:message_id>/read', methods=['PUT'])
def mark_message_read(message_id):
    """Mark a message as read"""
    user_id = request.json.get('user_id')
    
    if not user_id:
        return jsonify({"detail": "User ID is required"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Make sure the user is the recipient
        cursor.execute("""
            SELECT * FROM messages
            WHERE id = %s AND recipient_id = %s
        """, (message_id, user_id))
        # This query:
        # 1. Verifies that the user is the recipient of the message
        # 2. Acts as a security check to prevent unauthorized marking of messages as read
        
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"detail": "Message not found or you are not the recipient"}), 404
        
        # Mark as read
        now = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute("""
            UPDATE messages
            SET is_read = TRUE, updated_at = %s
            WHERE id = %s
        """, (now, message_id))
        # This query:
        # 1. Updates the message to mark it as read
        # 2. Updates the 'updated_at' timestamp to track when it was read
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"detail": "Message marked as read"})
    except mysql.connector.Error as err:
        return jsonify({"detail": f"Database error: {str(err)}"}), 500

if __name__ == '__main__':
    app.run(debug=True) 