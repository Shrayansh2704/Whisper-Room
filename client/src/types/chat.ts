export interface ChatMessage {
    id: string;
    senderId?: string;
    sender: string;
    text: string;
    time: string;
    system?: boolean;
}

export interface Participant {
    id: string;
    name: string;
    admin: boolean;
}