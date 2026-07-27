import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
    Crown,
    LogOut,
    MessageCircle,
    Phone,
    Send,
    Users,
} from "lucide-react";

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
    const navigate = useNavigate();
    const { roomId } = useParams();
    const { state } = useLocation();

    const username = state?.name ?? "Guest";

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
            <header className="border-b border-zinc-800 px-8 py-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Whisper Room
                        </h1>

                        <p className="mt-1 text-sm text-zinc-400">
                            Room ID: {roomId}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="border-zinc-700"
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    Participants
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="border-zinc-800 bg-zinc-900 text-white">
                                <DialogHeader>
                                    <DialogTitle>
                                        Participants
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4">
                                    {participants.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {user.name[0].toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <span>{user.name}</span>
                                            </div>

                                            {user.admin && (
                                                <Crown className="h-5 w-5 text-yellow-400" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>

                        {isAdmin && (
                            <Button
                                onClick={() =>
                                    navigate(`/meeting/${roomId}`)
                                }
                            >
                                <Phone className="mr-2 h-4 w-4" />
                                Start Meeting
                            </Button>
                        )}

                        <Button
                            variant="destructive"
                            onClick={() => navigate("/")}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Leave
                        </Button>
                    </div>
                </div>
            </header>

            {/* Chat */}
            <section className="flex flex-1 flex-col overflow-hidden px-8 py-6">
                <Card className="flex flex-1 flex-col border-zinc-800 bg-zinc-900">
                    <div className="flex items-center gap-2 border-b border-zinc-800 p-5">
                        <MessageCircle className="h-5 w-5" />
                        <h2 className="font-semibold text-white">
                            Chat
                        </h2>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto p-6">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${
                                    msg.sender === username
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div className="max-w-md rounded-xl bg-zinc-800 px-4 py-3">
                                    <div className="mb-1 text-xs text-zinc-400">
                                        {msg.sender}
                                    </div>

                                    <div className="text-sm text-white">
                                        {msg.text}
                                    </div>

                                    <div className="mt-2 text-right text-[10px] text-zinc-500">
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-zinc-800 p-5">
                        <div className="flex gap-3">
                            <Input
                                value={message}
                                placeholder="Type your message..."
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        sendMessage();
                                    }
                                }}
                            />

                            <Button onClick={sendMessage}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </section>
        </main>
    );
}

export default ChatRoomPage;