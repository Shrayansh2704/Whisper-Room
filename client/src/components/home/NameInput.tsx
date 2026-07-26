import { User } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

function NameInput({ value, onChange }: Props) {
    return (
        <div className="relative">
            <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />

            <Input
                className="h-12 border-zinc-700 bg-zinc-800 pl-10 text-white placeholder:text-zinc-500"
                placeholder="Enter your name"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export default NameInput;