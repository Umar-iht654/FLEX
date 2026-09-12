from flask import Blueprint, request, jsonify
from flask_socketio import emit, disconnect
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageResponse
from app.websocket.connection_manager import ConnectionManager

bp = Blueprint('messaging', __name__)
manager = ConnectionManager()

@bp.route('/send', methods=['POST'])
def send_message():
    db = next(get_db())
    data = request.get_json()
    message = MessageCreate(**data)
    
    db_message = Message(
        content=message.content,
        sender_id=message.sender_id,
        receiver_id=message.receiver_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Emit message to all connected clients
    emit('message', MessageResponse.from_orm(db_message).dict(), broadcast=True, namespace='/ws')
    return jsonify(MessageResponse.from_orm(db_message).dict())

# WebSocket events using Flask-SocketIO
def init_socketio(socketio):
    @socketio.on('connect', namespace='/ws')
    def handle_connect():
        client_id = request.sid
        manager.connect(client_id, request.sid)
        emit('message', {'data': f'Client #{client_id} joined'}, broadcast=True)

    @socketio.on('disconnect', namespace='/ws')
    def handle_disconnect():
        client_id = request.sid
        manager.disconnect(client_id)
        emit('message', {'data': f'Client #{client_id} left the chat'}, broadcast=True)

    @socketio.on('message', namespace='/ws')
    def handle_message(data):
        emit('message', {'data': data}, broadcast=True) 