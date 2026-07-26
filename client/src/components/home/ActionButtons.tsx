import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    onCreate: () => void;
    onJoin: () => void;
}

function ActionButtons({ onCreate, onJoin }: Props) {
    return (
        <div className="space-y-3">
            <Button
                className="h-12 w-full cursor-pointer rounded-xl"
                onClick={onCreate}
            >
                <Plus className="mr-2 h-4 w-4" />
                Create Room
            </Button>

            <Button
                variant="secondary"
                className="h-12 w-full cursor-pointer rounded-xl"
                onClick={onJoin}
            >
                <ArrowRight className="mr-2 h-4 w-4" />
                Join Room
            </Button>
        </div>
    );
}

export default ActionButtons;