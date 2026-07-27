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

interface Participant {
    id: number;
    name: string;
    admin: boolean;
}

interface ParticipantsDialogProps {
    participants: Participant[];
}

function ParticipantsDialog({
    participants,
}: ParticipantsDialogProps) {
    return (
        <Dialog>
            <DialogTrigger>
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
    );
}

export default ParticipantsDialog;