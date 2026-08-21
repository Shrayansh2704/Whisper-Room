import { WebSocket } from "ws";
import crypto from "crypto";

import {
    AnswerPayload,
    ClientMessage,
    CreateRoomPayload,
    IceCandidatePayload,
    JoinRoomPayload,
    KickUserPayload,
    MessageType,
    OfferPayload,
    SendMessagePayload,
} from "../types/message.js";

import { roomManager } from "../rooms/RoomManager.js";
import { userManager } from "../rooms/UserManager.js";

function sendError(
    socket: WebSocket,
    message: string
) {
    socket.send(
        JSON.stringify({
            type: MessageType.ERROR,
            payload: { message },
        })
    );
}

function sendRoomState(
    socket: WebSocket,
    roomId: string,
    userId: string,
    type:
        | MessageType.ROOM_CREATED
        | MessageType.ROOM_JOINED
) {
    socket.send(
        JSON.stringify({
            type,
            payload: {
                roomId,
                userId,
                participants:
                    roomManager.getParticipants(roomId),
            },
        })
    );
}

export function handleMessage(
    socket: WebSocket,
    message: ClientMessage
) {
    switch (message.type) {
        case MessageType.CREATE_ROOM: {
            const payload =
                message.payload as CreateRoomPayload;

            let user = userManager.getUser(socket);

            if (!user) {
                user = userManager.createUser(
                    socket,
                    payload.name
                );
            }

            if (user.roomId) {
                sendError(
                    socket,
                    "You are already in a room"
                );
                break;
            }

            const roomId =
                roomManager.createRoom(user);

            if (!roomId) {
                sendError(
                    socket,
                    "Unable to create room"
                );
                break;
            }

            sendRoomState(
                socket,
                roomId,
                user.id,
                MessageType.ROOM_CREATED
            );

            break;
        }

        case MessageType.JOIN_ROOM: {
            const payload =
                message.payload as JoinRoomPayload;

            let user = userManager.getUser(socket);

            if (!user) {
                user = userManager.createUser(
                    socket,
                    payload.name
                );
            }

            const result = roomManager.joinRoom(
                payload.roomId,
                user
            );

            if (result === "invalid") {
                sendError(
                    socket,
                    user.roomId
                        ? "You are already in another room"
                        : "Room not found"
                );
                break;
            }

            sendRoomState(
                socket,
                payload.roomId,
                user.id,
                MessageType.ROOM_JOINED
            );

            if (result === "joined") {
                const participant =
                    roomManager
                        .getParticipants(payload.roomId)
                        .find(
                            (participant) =>
                                participant.id === user.id
                        );

                roomManager.broadcastExcept(
                    payload.roomId,
                    {
                        type: MessageType.USER_JOINED,
                        payload: {
                            id: user.id,
                            name: user.name,
                            admin:
                                participant?.admin ?? false,
                        },
                    },
                    user.id
                );
            }

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
            console.log(`${user.name} Left Room: ${result.roomId}`);
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

            if (!user.roomId) {
                sendError(
                    socket,
                    "You are not in a room"
                );
                break;
            }

            const room = roomManager.getRoom(user.roomId);

            if (
                !room ||
                room.users.get(user.id) !== user
            ) {
                sendError(
                    socket,
                    "You are not a member of this room"
                );
                break;
            }
            const payload = message.payload as SendMessagePayload;
            roomManager.broadcast(user.roomId, {
                type : MessageType.MESSAGE_RECEIVED,
                payload: {
                    senderId: user.id,
                    senderName: user.name,
                    messageId: crypto.randomUUID(),
                    message: payload.message,
                },
            });
            break;
        }

        case MessageType.OFFER: {
            const sender = userManager.getUser(socket);
            if(!sender){
                socket.send(
                    JSON.stringify({
                        type : MessageType.ERROR,
                        payload: {
                            message : "User not Found",
                        },
                    })
                );
                break;
            }

            const payload = message.payload as OfferPayload;
            const target = userManager.getUserById(payload.targetUserId);

            if (!target) {
                sendError(
                    socket,
                    "Target user not found"
                );
                break;
            }

            if (
                !sender.roomId ||
                target.roomId !== sender.roomId
            ) {
                sendError(
                    socket,
                    "Target user is not in your room"
                );
                break;
            }

            target.socket.send(
                JSON.stringify({
                    type : MessageType.OFFER,
                    payload : {
                        senderId : sender.id,
                        senderName : sender.name,
                        offer : payload.offer,
                    },
                })
            );

            break;
        }

        case MessageType.ANSWER: {
            const sender = userManager.getUser(socket);
            if(!sender){
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

            const payload = message.payload as AnswerPayload;
            const target = userManager.getUserById(payload.targetUserId);

            if (!target) {
                sendError(
                    socket,
                    "Target user not found."
                );
                break;
            }

            if (
                !sender.roomId ||
                target.roomId !== sender.roomId
            ) {
                sendError(
                    socket,
                    "Target user is not in your room"
                );
                break;
            }

            target.socket.send(
                JSON.stringify({
                    type: MessageType.ANSWER,
                    payload: {
                        senderId: sender.id,
                        senderName: sender.name,
                        answer: payload.answer,
                    },
                })
            );

            break;
        }

        case MessageType.ICE_CANDIDATE: {
            const sender = userManager.getUser(socket);
            if (!sender) {
                socket.send(
                    JSON.stringify({
                        type: MessageType.ERROR,
                        payload: {
                            message: "User not found.",
                        },
                    })
                );
                break;
            }

            const payload = message.payload as IceCandidatePayload;

            const target =
                userManager.getUserById(
                    payload.targetUserId
                );

            if (!target) {
                sendError(
                    socket,
                    "Target user not found."
                );
                break;
            }

            if (
                !sender.roomId ||
                target.roomId !== sender.roomId
            ) {
                sendError(
                    socket,
                    "Target user is not in your room"
                );
                break;
            }

            target.socket.send(
                JSON.stringify({
                    type: MessageType.ICE_CANDIDATE,
                    payload: {
                        senderId: sender.id,
                        senderName: sender.name,
                        candidate: payload.candidate,
                    },
                })
            );

            break;

        }

        default:
            console.log("Unknown Message");
    }
}

