import crypto from "crypto";
import { WebSocket } from "ws";

import { User } from "./User.js";

export class UserManager {
    private users = new Map<WebSocket, User>();

    createUser(socket: WebSocket, name: string): User {
        const user: User = {
            id: crypto.randomUUID(),
            name,
            socket,
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
}

export const userManager = new UserManager();