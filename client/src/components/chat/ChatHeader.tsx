import { LogOut, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import ParticipantsDialog from "./ParticipantsDialog";
interface Participant {
    id: string;
    name: string;
    admin: boolean;
}

interface ChatHeaderProps {
    roomId: string;
    participants: Participant[];
    isAdmin: boolean;
}

function ChatHeader({
    roomId,
    participants,
    isAdmin,
}: ChatHeaderProps) {
    const navigate = useNavigate();

    return (
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
                    <ParticipantsDialog
                        participants={participants}
                    />

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
    );
}

export default ChatHeader;