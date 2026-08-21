import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatInput from "@/components/chat/ChatInput";
import { Card } from "@/components/ui/card";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatHeader from "@/components/chat/ChatHeader";
import { MessageCircle } from "lucide-react";
import websocket from "@/services/websocket";

import {
    MessageType,
    type ServerMessage,
    type UserJoinedPayload,
    type MessageReceivedPayload,
    type UserLeftPayload,
    type AdminChangedPayload,
    
} from "@/types/message";

import type {
    ChatMessage,
    Participant,
} from "@/types/chat";



function ChatRoomPage() {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const { state } = useLocation();

    const routeState = state as
        | {
            roomId?: string;
            name?: string;
            userId?: string;
            participants?: Participant[];
            joined?: boolean;
        }
        | null;

    const username = routeState?.name ?? "Guest";

    const currentUserId = routeState?.userId ?? "";
    useEffect(() => {
        const handleMessage = (message: ServerMessage) => {
            switch (message.type) {
                case MessageType.ROOM_JOINED: {
                    console.log(
                        "Joined room:",
                        message.payload
                    );
                    break;
                }

                case MessageType.USER_JOINED: {
                    const payload =
                        message.payload as UserJoinedPayload;

                    // Don't add yourself
                    if (payload.id === currentUserId) {
                        break;
                    }

                    setParticipants((prev) => {
                        const alreadyExists = prev.some(
                            (participant) =>
                                participant.id === payload.id
                        );

                        if (alreadyExists) {
                            return prev;
                        }

                        return [
                            ...prev,
                            {
                                id: payload.id,
                                name: payload.name,
                                admin: payload.admin,
                            },
                        ];
                    });

                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            sender: "System",
                            text: `${payload.name} joined the room`,
                            time: new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                        },
                    ]);

                    break;
                }

                case MessageType.MESSAGE_RECEIVED: {
                    const payload =
                        message.payload as MessageReceivedPayload;

                    console.log(
                        "MESSAGE PAYLOAD:",
                        payload
                    );

                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            sender: payload.senderName,
                            text: payload.message,
                            time: new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                        },
                    ]);

                    break;
                }

                case MessageType.USER_LEFT: {
                    const payload =
                        message.payload as UserLeftPayload;

                    setParticipants((prev) =>
                        prev.filter(
                            (participant) =>
                                participant.id !== payload.id
                        )
                    );

                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            sender: "System",
                            text: `${payload.name} left the room`,
                            time: new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                            system: true,
                        },
                    ]);

                    break;
                }

                case MessageType.ADMIN_CHANGED: {
                    const payload =
                        message.payload as AdminChangedPayload;

                    setParticipants((prev) =>
                        prev.map((participant) => ({
                            ...participant,
                            admin:
                                participant.id === payload.id,
                        }))
                    );

                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            sender: "System",
                            text: `${payload.name} is now the admin`,
                            time: new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                            system: true,
                        },
                    ]);

                    break;
                }

                case MessageType.USER_KICKED: {
                    console.log("You were kicked from the room");

                    navigate("/");
                    break;
                }

                case MessageType.ROOM_LEFT: {
                    console.log("Successfully left room");
                    navigate("/");
                    break;
                }
            }
        };
        
        websocket.subscribe(handleMessage);

        return () => {
            websocket.unsubscribe(handleMessage);
        };
    }, [currentUserId]);

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "Welcome",
            sender: "System",
            text: `Welcome to room ${roomId}`,
            time: "Now",
            system : true,
        },
    ]);

    const [participants, setParticipants] =useState<Participant[]>(routeState?.participants ?? []);

    const [message, setMessage] = useState("");

    const isAdmin = useMemo(
        () =>
            participants.find(
                (participant) =>
                    participant.id === currentUserId
            )?.admin ?? false,
        [participants, currentUserId]
    );

    console.log("PARTICIPANTS:", participants);
    console.log("USERNAME:", username);

    const sendMessage = () => {
        if (!message.trim()) return;

        websocket.send({
            type: MessageType.SEND_MESSAGE,
            payload: {
                message: message.trim(),
            }
        });

        setMessage("");
    };

    return (
        <main className="flex h-screen flex-col bg-zinc-950 text-white">
            {/* Header */}
            <ChatHeader
                roomId={roomId ?? ""}
                participants={participants}
                isAdmin={isAdmin}
                currentUserId={currentUserId}
            />

            {/* Chat */}
            <section className="flex flex-1 flex-col overflow-hidden px-8 py-6">
                <Card className="flex flex-1 flex-col border-zinc-800 bg-zinc-900">
                    <div className="flex items-center gap-2 border-b border-zinc-800 p-5">
                        <MessageCircle className="h-5 w-5" />
                        <h2 className="font-semibold text-white">
                            Chat
                        </h2>
                    </div>

                    <ChatMessages
                        messages={messages}
                        username={username}
                    />

                    <ChatInput
                        message={message}
                        setMessage={setMessage}
                        sendMessage={sendMessage}
                    />
                </Card>
            </section>
        </main>
    );
}

export default ChatRoomPage;