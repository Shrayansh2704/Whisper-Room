import { Room } from "./Room.js";
import { User } from "./User.js";
import { generateRoomId } from "../utils/generateRoomId.js";
import { ServerMessage } from "../types/message.js";

export class RoomManager {
    private rooms: Map<string, Room> = new Map();
    private roomDeletionTimers: Map<string,ReturnType<typeof setTimeout>> = new Map();

    createRoom(admin: User): string | null{
        if(admin.roomId) return null;
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
        console.log("ROOM CREATED:", roomId);
        console.log("CURRENT ROOMS:", [...this.rooms.keys()]);
        return roomId;
    }

    getRoom(roomId: string) {
        return this.rooms.get(roomId);
    }

    getParticipants(roomId: string) {
        const room = this.rooms.get(roomId);

        if (!room) {
            return [];
        }

        return [...room.users.values()].map((user) => ({
            id: user.id,
            name: user.name,
            admin: user.id === room.adminId,
        }));
    }

    joinRoom(
        roomId: string,
        user: User
    ): "joined" | "already_joined" | "invalid" {
        const room = this.rooms.get(roomId);

        console.log("JOIN REQUEST:", roomId);
        console.log(
            "CURRENT ROOMS:",
            [...this.rooms.keys()]
        );

        if (!room) {
            return "invalid";
        }

        if (
            user.roomId === roomId &&
            room.users.has(user.id)
        ) {
            return "already_joined";
        }

        if (user.roomId) {
            return "invalid";
        }

        this.cancelDeletionTimer(roomId);

        user.roomId = roomId;
        room.users.set(user.id, user);

        return "joined";
    }

    broadcast(
        roomId: string,
        message: ServerMessage
    ): boolean {
        return this.broadcastExcept(roomId, message);
    }

    broadcastExcept(
        roomId: string,
        message: ServerMessage,
        excludedUserId?: string
    ): boolean {
        const room = this.rooms.get(roomId);

        if (!room) {
            return false;
        }

        const data = JSON.stringify(message);

        for (const user of room.users.values()) {
            if (user.id === excludedUserId) {
                continue;
            }

            if (user.socket.readyState === user.socket.OPEN) {
                user.socket.send(data);
            }
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

    disconnectUser(user: User): {
        roomId: string;
        newAdmin?: User;
        deleted: boolean;
    } | null {
        if (!user.roomId) return null;

        const room = this.rooms.get(user.roomId);
        if (!room) return null;

        const roomId = room.id;

        room.users.delete(user.id);
        user.roomId = undefined;

        // Other users are still in the room
        if (room.users.size > 0) {
            if (room.adminId === user.id) {
                const newAdmin = room.users.values().next().value as User;

                room.adminId = newAdmin.id;

                return {
                    roomId,
                    deleted: false,
                    newAdmin,
                };
            }

            return {
                roomId,
                deleted: false,
            };
        }

        this.scheduleDeletion(roomId);
        return {
            roomId,
            deleted: false,
        };

    }

    private scheduleDeletion(roomId: string): void {
        this.cancelDeletionTimer(roomId);

        const timer = setTimeout(() => {
            const currentRoom = this.rooms.get(roomId);

            if (
                currentRoom &&
                currentRoom.users.size === 0
            ) {
                this.rooms.delete(roomId);

                console.log(
                    "ROOM Deleted After Disconnect:",
                    roomId
                );
            }

            this.roomDeletionTimers.delete(roomId);
        }, 10000);

        this.roomDeletionTimers.set(roomId, timer);
    }

    private cancelDeletionTimer(roomId: string): void {
        const timer =
            this.roomDeletionTimers.get(roomId);

        if (!timer) {
            return;
        }

        clearTimeout(timer);
        this.roomDeletionTimers.delete(roomId);
    }
}

export const roomManager = new RoomManager();