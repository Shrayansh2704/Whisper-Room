import MessageBubble from "./MessageBubble";
interface ChatMessage {
    id: number;
    sender: string;
    text: string;
    time: string;
}

interface ChatMessagesProps {
    messages: ChatMessage[];
    username: string;
}

function ChatMessages({
    messages,
    username,
}: ChatMessagesProps) {
    return (
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.map((msg) => (
                <MessageBubble
                    key={msg.id}
                    message={msg}
                    username={username}
                />
            ))}
        </div>
    );
}

export default ChatMessages;