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

    // System message
    if (message.system) {
        return (
            <div className="flex justify-center">
                <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-center">
                    <div className="text-sm font-medium text-orange-400">
                        {message.text}
                    </div>

                    <div className="mt-1 text-[10px] text-orange-300/60">
                        {message.time}
                    </div>
                </div>
            </div>
        );
    }

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