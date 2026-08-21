import { Crown, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import websocket from "@/services/websocket";
import { MessageType } from "@/types/message";

interface Participant {
    id: string;
    name: string;
    admin: boolean;
}

interface ParticipantsDialogProps {
    participants: Participant[];
    isAdmin: boolean;
    currentUserId: string;
}

function ParticipantsDialog({
    participants,
    isAdmin,
    currentUserId,
}: ParticipantsDialogProps) {

    const handleKick = (userId: string) => {
        websocket.send({
            type: MessageType.KICK_USER,
            payload: {
                userId,
            },
        });
    };

    return (
        <Dialog>
            <DialogTrigger
                render={
                    <Button
                        variant="outline"
                        className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
                    />
                }
            >
                <Users className="mr-2 h-4 w-4" />
                Participants
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
                                        {user.name?.[0]?.toUpperCase() ?? "?"}
                                    </AvatarFallback>
                                </Avatar>

                                <span>
                                    {user.name ?? "Unknown User"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {user.admin && (
                                    <Crown className="h-5 w-5 text-yellow-400" />
                                )}

                                {isAdmin &&
                                    user.id !== currentUserId &&
                                    !user.admin && (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                handleKick(user.id)
                                            }
                                        >
                                            Kick
                                        </Button>
                                    )}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ParticipantsDialog;