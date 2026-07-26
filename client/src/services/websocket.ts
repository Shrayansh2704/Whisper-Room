import type { ClientMessage, ServerMessage } from "@/types/message";

type MessageListener = (message: ServerMessage) => void;

class WebSocketService {
    private socket: WebSocket | null = null;
    private listeners: MessageListener[] = [];

    connect() {
        if (this.socket) return;

        this.socket = new WebSocket("ws://localhost:3000");

        this.socket.onopen = () => {
            console.log("✅ Connected");
        };

        this.socket.onmessage = (event) => {
            const message: ServerMessage = JSON.parse(event.data);

            this.listeners.forEach(listener => listener(message));
        };

        this.socket.onclose = () => {
            this.socket = null;
        };
    }

    send(message: ClientMessage) {
        if (!this.socket) return;

        if (this.socket.readyState !== WebSocket.OPEN) return;

        this.socket.send(JSON.stringify(message));
    }

    subscribe(listener: MessageListener) {
        this.listeners.push(listener);
    }

    unsubscribe(listener: MessageListener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    disconnect() {
        this.socket?.close();
        this.socket = null;
    }
}

export default new WebSocketService();