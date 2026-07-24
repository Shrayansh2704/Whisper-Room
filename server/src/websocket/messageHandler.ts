import { WebSocket } from "ws";

import {
    ClientMessage,
    CreateRoomPayload,
    JoinRoomPayload,
    KickUserPayload,
    MessageType,
    SendMessagePayload,
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

        case MessageType.LEAVE_ROOM: {
            const user = userManager.getUser(socket);
            if(!user){
                socket.send(
                    JSON.stringify({
                        type : MessageType.ERROR,
                        payload: {
                            message : "User not Found",
                        },
                    })
                );
                break ;
            }

            const result = roomManager.leaveRoom(user);
            if(!result){
                socket.send(
                    JSON.stringify({
                        type : MessageType.ERROR,
                        payload: {
                            message : "you are not in any room",
                        },
                    })
                );
                break ;
            }

            socket.send(
                JSON.stringify({
                    type : MessageType.ROOM_LEFT,
                    payload: {},
                })
            );
            roomManager.broadcast(result.roomId, {
                type: MessageType.USER_LEFT,
                payload: {
                    id: user.id,
                    name: user.name,
                },
            });

            if (result.newAdmin) {
                roomManager.broadcast(result.roomId, {
                    type: MessageType.ADMIN_CHANGED,
                    payload: {
                        id: result.newAdmin.id,
                        name: result.newAdmin.name,
                    },
                });
            }

            break;
        }

        case MessageType.KICK_USER: {
            const admin = userManager.getUser(socket);
            if(!admin){
                socket.send(
                    JSON.stringify({
                        type : MessageType.ERROR,
                        payload : {
                            message : "User not Found",
                        },
                    })
                );
                break;
            }

            const payload = message.payload as KickUserPayload;
            const result = roomManager.kickUser(admin, payload.userId);
            if(!result){
                socket.send(
                    JSON.stringify({
                        type : MessageType.ERROR,
                        payload : {
                            message : "Kicked Failed . Either you are not admin or user does not exist",
                        },
                    })
                );
                break;
            }
            result.kickedUser.socket.send(
                JSON.stringify({
                    type : MessageType.USER_KICKED,
                    payload : {
                        message : "You were removed by the admin"
                    },
                })
            );
            socket.send(
                JSON.stringify({
                    type: MessageType.KICK_SUCCESS,
                    payload: {
                        userId: result.kickedUser.id,
                    },
                })
            );
            roomManager.broadcast(result.roomId, {
                type: MessageType.USER_LEFT,
                payload: {
                    id: result.kickedUser.id,
                    name: result.kickedUser.name,
                },
            });
            break;
        }

        case MessageType.SEND_MESSAGE: {
            const user = userManager.getUser(socket);
            if(!user){
                socket.send(
                    JSON.stringify({
                        type : MessageType.ERROR,
                        payload: {
                            message : "User Not Found",
                        },
                    })
                );
                break;
            }

            if(!user.roomId){
                socket.send(
                    JSON.stringify({
                        type : MessageType.ERROR,
                        payload : {
                            message : "You are not in a room",
                        },
                    })
                );
                break;
            }
            const payload = message.payload as SendMessagePayload;
            roomManager.broadcast(user.roomId, {
                type : MessageType.MESSAGE_RECEIVED,
                payload : {
                    senderId : user.id,
                    senderName : user.name,
                    message : payload.message,
                },
            });
            break;
        }

        default:
            console.log("Unknown Message");
    }
}