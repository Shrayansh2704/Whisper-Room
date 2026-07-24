import crypto from "crypto";
import { WebSocket } from "ws";

import { User } from "./User.js";

export class UserManager {
    private users = new Map<WebSocket, User>();

    createUser(socket: WebSocket, name: string): User {

        const existingUser = this.users.get(socket);
        if (existingUser) {
            return existingUser;
        }

        const user: User = {
            id: crypto.randomUUID(),
            name,
            socket,
            roomId : undefined,
        };

        this.users.set(socket, user);

        return user;
    }

    getUser(socket: WebSocket): User | undefined {
        return this.users.get(socket);
    }

    removeUser(socket: WebSocket): void {
        this.users.delete(socket);
    }

    getUserById(id: string) : User | undefined {
        for(const user of this.users.values()){
            if(user.id===id) return user;
        }

        return undefined;
    }
}

export const userManager = new UserManager();