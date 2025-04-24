from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageResponse
from app.websocket.connection_manager import ConnectionManager

router = APIRouter()
manager = ConnectionManager()

@router.post("/send", response_model=MessageResponse)
async def send_message(
    message: MessageCreate,
    db: Session = Depends(get_db)
):
    db_message = Message(
        content=message.content,
        sender_id=message.sender_id,
        receiver_id=message.receiver_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Notify WebSocket clients
    await manager.broadcast_message(db_message)
    return db_message

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming messages
            await manager.broadcast_message(data)
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        await manager.broadcast_message(f"Client #{client_id} left the chat") 