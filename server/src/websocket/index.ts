import { WebSocketServer } from "ws";
import http from "http";
import { ClientMessage, MessageType } from "../types/message.js";
import { handleMessage } from "./messageHandler.js";
import { userManager } from "../rooms/UserManager.js";

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
            userManager.removeUser(socket);

            console.log("Client Disconnected");
        });
    });

    return wss;
}