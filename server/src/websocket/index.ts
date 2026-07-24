import { WebSocketServer } from "ws";
import http from "http";
import { ClientMessage, MessageType } from "../types/message.js";
import { handleMessage } from "./messageHandler.js";
import { userManager } from "../rooms/UserManager.js";
import { roomManager } from "../rooms/RoomManager.js";

export function setupWebSocketServer(server : http.Server){
    const wss = new WebSocketServer({server});
    wss.on("connection", (socket)=>{
        console.log("Client Connected");

        socket.send(
            JSON.stringify({
                type : MessageType.CONNECTED,
                payload : {
                    message: "Welcome to Whisper Room",
                },
            })
        );

        socket.on("message", (data)=>{
            try{
                const message: ClientMessage = JSON.parse(data.toString());
                handleMessage(socket, message);
            }catch(err){
                console.error("Invalid Message", err);
            }            
        });

        socket.on("close", () => {
            const user = userManager.getUser(socket);
            if(!user) return;
            const result = roomManager.leaveRoom(user);
            if(result){
                roomManager.broadcast(result.roomId,{
                    type : MessageType.USER_LEFT,
                    payload : {
                        id : user.id,
                        name : user.name,
                    },
                });
                if(result.newAdmin){
                    roomManager.broadcast(result.roomId, {
                        type : MessageType.ADMIN_CHANGED,
                        payload : {
                            id : result.newAdmin.id,
                            name : result.newAdmin.name,
                        },
                    });
                }
            }

            userManager.removeUser(socket);
            console.log(`${user.name} Disconnected`);
        });
    });

    return wss;
}