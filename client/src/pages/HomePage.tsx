import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ActionButtons from "@/components/home/ActionButtons";
import HomeCard from "@/components/home/HomeCard";
import HomeHeader from "@/components/home/HomeHeader";
import NameInput from "@/components/home/NameInput";
import RoomInput from "@/components/home/RoomInput";

import websocket from "@/services/websocket";

import {
    MessageType,
    type CreateRoomPayload,
    type JoinRoomPayload,
    type ClientMessage,
    type ServerMessage,
    type RoomStatePayload,
} from "@/types/message";

function HomePage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");

    useEffect(() => {
        const listener = (message: ServerMessage) => {
            switch (message.type) {
                case MessageType.ROOM_CREATED: {
                    const payload = message.payload as RoomStatePayload;

                    navigate(`/chat/${payload.roomId}`, {
                        state: {
                            roomId : payload.roomId,
                            name,
                            userId : payload.userId,
                            participants : payload.participants,
                            joined : true,
                        },
                    });

                    break;
                }

                case MessageType.ROOM_JOINED: {
                    const payload =
                        message.payload as RoomStatePayload;

                    navigate(`/chat/${payload.roomId}`, {
                        state: {
                            roomId: payload.roomId,
                            name,
                            userId: payload.userId,
                            participants: payload.participants,
                            joined: true,
                        },
                    });

                    break;
                }

                case MessageType.ERROR:
                    alert(
                        (message.payload as { message: string }).message
                    );
                    break;
            }
        };

        websocket.subscribe(listener);

        websocket.connect().catch((error) => {
            console.error("Failed to connect:", error);
        });

        return () => {
            websocket.unsubscribe(listener);
        };
    }, [navigate, name]);

    const createRoom = async () => {
        if (!name.trim()) {
            alert("Enter your name");
            return;
        }

        await websocket.connect();

        const message: ClientMessage<CreateRoomPayload> = {
            type: MessageType.CREATE_ROOM,
            payload: {
                name : name.trim(),
            },
        };

        websocket.send(message);
    };

    const joinRoom = async () => {
        if (!name.trim() || !roomId.trim()) {
            alert("Enter all fields");
            return;
        }

        await websocket.connect();

        const message: ClientMessage<JoinRoomPayload> = {
            type: MessageType.JOIN_ROOM,
            payload: {
                roomId: roomId.trim(),
                name: name.trim(),
            },
        };

        websocket.send(message);
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
            <HomeCard>
                <HomeHeader />

                <NameInput
                    value={name}
                    onChange={setName}
                />

                <RoomInput
                    value={roomId}
                    onChange={setRoomId}
                />

                <ActionButtons
                    onCreate={createRoom}
                    onJoin={joinRoom}
                />
            </HomeCard>
        </main>
    );
}

export default HomePage;