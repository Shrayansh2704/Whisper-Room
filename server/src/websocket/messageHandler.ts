import { WebSocket } from "ws";

import {
    ClientMessage,
    CreateRoomPayload,
    JoinRoomPayload,
    MessageType,
} from "../types/message.js";

import { roomManager } from "../rooms/RoomManager.js";
import { userManager } from "../rooms/UserManager.js";

export function handleMessage(
    socket: WebSocket,
    message: ClientMessage
) {
    switch (message.type) {
        case MessageType.CREATE_ROOM: {
            const payload = message.payload as CreateRoomPayload;

            let user = userManager.getUser(socket);

            if (!user) {
                user = userManager.createUser(socket, payload.name);
            }

            const roomId = roomManager.createRoom(user);

            socket.send(
                JSON.stringify({
                    type: MessageType.ROOM_CREATED,
                    payload: {
                        roomId,
                    },
                })
            );

            console.log(`${user.name} created room ${roomId}`);

            break;
        }

        case MessageType.JOIN_ROOM: {
            const payload = message.payload as JoinRoomPayload;
            let user = userManager.getUser(socket);
            if(!user){
                user = userManager.createUser(socket, payload.name);
            }

            const joined = roomManager.joinRoom(payload.roomId, user);
            if(!joined){
                socket.send(
                    JSON.stringify({
                        type: MessageType.ERROR,
                        payload:{
                            message : "Room not found",
                        },
                    })
                );
                break;
            }
            socket.send(
                JSON.stringify({
                    type: MessageType.ROOM_JOINED,
                    payload: {
                        roomId: payload.roomId,
                    },
                })
            );
            roomManager.broadcast(payload.roomId, {
                type: MessageType.USER_JOINED,
                payload: {
                    id: user.id,
                    name: user.name,
                },
            });
            break;   
        }

        default:
            console.log("Unknown Message");
    }
}