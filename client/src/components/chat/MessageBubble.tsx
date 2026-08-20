import type { ChatMessage } from "@/types/chat";

interface MessageBubbleProps {
    message: ChatMessage;
    username: string;
}

function MessageBubble({
    message,
    username,
}: MessageBubbleProps) {
    const isMine = message.sender === username;

    return (
        <div
            className={`flex ${
                isMine
                    ? "justify-end"
                    : "justify-start"
            }`}
        >
            <div className="max-w-md rounded-xl bg-zinc-800 px-4 py-3">
                <div className="mb-1 text-xs text-zinc-400">
                    {message.sender}
                </div>

                <div className="text-sm text-white">
                    {message.text}
                </div>

                <div className="mt-2 text-right text-[10px] text-zinc-500">
                    {message.time}
                </div>
            </div>
        </div>
    );
}

export default MessageBubble;