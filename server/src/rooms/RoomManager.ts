import { Room } from "./Room.js";
import { User } from "./User.js";
import { generateRoomId } from "../utils/generateRoomId.js";
import { ServerMessage } from "../types/message.js";

export class RoomManager {
    private rooms: Map<string, Room> = new Map();

    createRoom(admin: User): string {
        let roomId = generateRoomId();

        while (this.rooms.has(roomId)) {
            roomId = generateRoomId();
        }

        admin.roomId = roomId;

        const room: Room = {
            id: roomId,
            adminId: admin.id,
            users: new Map([[admin.id, admin]]),
        };

        this.rooms.set(roomId, room);
        return roomId;
    }

    getRoom(roomId: string) {
        return this.rooms.get(roomId);
    }

    joinRoom(roomId: string, user: User) : boolean{
        const room = this.rooms.get(roomId);
        if(!room) return false;
        user.roomId = roomId;
        room.users.set(user.id, user);
        return true;
    }
    broadcast(roomId: string, message: ServerMessage): boolean{
        const room = this.rooms.get(roomId);

        if(!room) return false;

        const data = JSON.stringify(message);

        for(const user of room.users.values()){
            user.socket.send(data);
        }

        return true;
    }  
}

export const roomManager = new RoomManager();