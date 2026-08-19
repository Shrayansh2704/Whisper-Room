import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    sendMessage: () => void;
}

function ChatInput({
    message,
    setMessage,
    sendMessage,
}: ChatInputProps) {
    return (
        <div className="border-t border-zinc-800 p-5">
            <div className="flex gap-3">
                <Input
                    value={message}
                    placeholder="Type your message..."
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                    className="text-white placeholder:text-zinc-500"
                />

                <Button onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export default ChatInput;