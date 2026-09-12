from typing import Dict, List
from flask import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.groups: Dict[str, List[str]] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
        # Remove from all groups
        for group in self.groups.values():
            if client_id in group:
                group.remove(client_id)

    async def send_personal_message(self, message: str, client_id: str):
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_text(message)

    async def broadcast_message(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

    async def join_group(self, client_id: str, group_id: str):
        if group_id not in self.groups:
            self.groups[group_id] = []
        if client_id not in self.groups[group_id]:
            self.groups[group_id].append(client_id)

    async def leave_group(self, client_id: str, group_id: str):
        if group_id in self.groups and client_id in self.groups[group_id]:
            self.groups[group_id].remove(client_id)

    async def broadcast_to_group(self, message: str, group_id: str):
        if group_id in self.groups:
            for client_id in self.groups[group_id]:
                if client_id in self.active_connections:
                    await self.active_connections[client_id].send_text(message) 