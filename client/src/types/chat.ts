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