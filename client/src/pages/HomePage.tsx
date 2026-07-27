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
} from "@/types/message";

function HomePage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");

    useEffect(() => {
        websocket.connect();

        const listener = (message: ServerMessage) => {
            switch (message.type) {
                case MessageType.ROOM_CREATED: {
                    const { roomId } = message.payload as {
                        roomId: string;
                    };

                    navigate(`/chat/${roomId}`, {
                        state: {
                            roomId,
                            name,
                        },
                    });

                    break;
                }

                case MessageType.ROOM_JOINED: {
                    const { roomId } = message.payload as {
                        roomId: string;
                    };

                    navigate(`/chat/${roomId}`, {
                        state: {
                            roomId,
                            name,
                        },
                    });

                    break;
                }

                case MessageType.ERROR:
                    alert((message.payload as { message: string }).message);
                    break;
            }
        };

        websocket.subscribe(listener);

        return () => {
            websocket.unsubscribe(listener);
        };
    }, [navigate, name]);

    const createRoom = () => {
        if (!name.trim()) {
            alert("Enter your name");
            return;
        }

        const message: ClientMessage<CreateRoomPayload> = {
            type: MessageType.CREATE_ROOM,
            payload: {
                name,
            },
        };

        websocket.send(message);
    };

    const joinRoom = () => {
        if (!name.trim() || !roomId.trim()) {
            alert("Enter all fields");
            return;
        }

        const message: ClientMessage<JoinRoomPayload> = {
            type: MessageType.JOIN_ROOM,
            payload: {
                roomId,
                name,
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