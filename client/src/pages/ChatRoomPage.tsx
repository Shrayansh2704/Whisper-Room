import { useMemo, useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import ChatInput from "@/components/chat/ChatInput";
import { Card } from "@/components/ui/card";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatHeader from "@/components/chat/ChatHeader";
import { MessageCircle } from "lucide-react";
import websocket from "@/services/websocket";

import { MessageType } from "@/types/message";

interface ChatMessage {
    id: number;
    sender: string;
    text: string;
    time: string;
}

interface Participant {
    id: number;
    name: string;
    admin: boolean;
}


function ChatRoomPage() {
    const { roomId } = useParams();
    const { state } = useLocation();

    const username = state?.name ?? "Guest";
    useEffect(() => {
        async function joinRoom() {
            await websocket.connect();

            websocket.send({
                type: MessageType.JOIN_ROOM,
                payload: {
                    roomId: roomId ?? "",
                    name: username,
                },
            });
        }

        joinRoom();

        return () => {
            websocket.disconnect();
        };
    }, [roomId, username]);

    // Temporary until backend sync
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            sender: "System",
            text: `Welcome to room ${roomId}`,
            time: "Now",
        },
    ]);

    const [participants] = useState<Participant[]>([
        {
            id: 1,
            name: username,
            admin: true,
        },
    ]);

    const [message, setMessage] = useState("");

    const isAdmin = useMemo(
        () => participants.find((p) => p.name === username)?.admin ?? false,
        [participants, username]
    );

    const sendMessage = () => {
        if (!message.trim()) return;

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                sender: username,
                text: message,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            },
        ]);

        setMessage("");
    };

    return (
        <main className="flex h-screen flex-col bg-zinc-950 text-white">
            {/* Header */}
            <ChatHeader
                roomId={roomId ?? ""}
                participants={participants}
                isAdmin={isAdmin}
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