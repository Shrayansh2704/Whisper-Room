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
    
    leaveRoom(user : User):{
        roomId : string;
        newAdmin?: User;
        deleted : boolean;
    } | null{
        if(!user.roomId) return null;
        const room = this.rooms.get(user.roomId);
        if(!room) return null;
        const roomId = room.id;
        room.users.delete(user.id);
        user.roomId = undefined;
        if(room.users.size===0){
            this.rooms.delete(roomId);
            return{
                roomId,
                deleted : true,
            };
        }

        if(room.adminId===user.id){
            const newAdmin = room.users.values().next().value as User;
            room.adminId = newAdmin.id;

            return{
                roomId, 
                deleted : false,
                newAdmin,
            };
        }

        return{
            roomId,
            deleted : false,
        };
    }

    kickUser(admin: User, userId:string) : {
        roomId : string;
        kickedUser : User;
    } | null{
        if(!admin.roomId) return null;
        const room = this.rooms.get(admin.roomId);
        if(!room) return null;
        if(room.adminId!=admin.id) return null;
        if (admin.id === userId) return null;
        const kickedUser = room.users.get(userId);
        if(!kickedUser) return null;
        room.users.delete(userId);
        kickedUser.roomId = undefined;
        return{
            roomId : room.id,
            kickedUser,
        };
    }


}

export const roomManager = new RoomManager();