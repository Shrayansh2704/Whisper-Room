import {
    type ClientMessage,
    type ServerMessage,
} from "@/types/message";

type MessageListener = (message: ServerMessage) => void;

class WebSocketService {
    private socket: WebSocket | null = null;
    private connectPromise: Promise<void> | null = null;
    private listeners = new Set<MessageListener>();
    

    async connect(): Promise<void> {
        if (this.socket?.readyState === WebSocket.OPEN) {
            return;
        }

        if (this.connectPromise) {
            return this.connectPromise;
        }

        const existingSocket = this.socket;

        if (existingSocket?.readyState === WebSocket.CONNECTING) {
            this.connectPromise = new Promise<void>((resolve, reject) => {
                const checkConnection = () => {
                    if (existingSocket.readyState === WebSocket.OPEN) {
                        resolve();
                    } else if (
                        existingSocket.readyState === WebSocket.CLOSED ||
                        existingSocket.readyState === WebSocket.CLOSING
                    ) {
                        reject(new Error("Failed to connect"));
                    } else {
                        window.setTimeout(checkConnection, 25);
                    }
                };

                checkConnection();
            }).finally(() => {
                this.connectPromise = null;
            });

            return this.connectPromise;
        }

        const url =
            import.meta.env.VITE_WS_URL ??
            "ws://localhost:3000";

        this.connectPromise = new Promise<void>((resolve, reject) => {
            const socket = new WebSocket(url);
            let opened = false;

            this.socket = socket;

            socket.onopen = () => {
                opened = true;
                console.log("Connected");
                resolve();
            };

            socket.onmessage = (event) => {
                try {
                    const message: ServerMessage =
                        JSON.parse(event.data);

                    this.listeners.forEach((listener) =>
                        listener(message)
                    );
                } catch (error) {
                    console.error(
                        "Invalid WebSocket message:",
                        error
                    );
                }
            };

            socket.onerror = () => {
                console.error("WebSocket error");

                if (!opened) {
                    if (this.socket === socket) {
                        this.socket = null;
                    }

                    reject(new Error("Failed to connect"));
                    socket.close();
                }
            };

            socket.onclose = () => {
                console.log("Disconnected");

                if (this.socket === socket) {
                    this.socket = null;
                }

                if (!opened) {
                    reject(new Error("Failed to connect"));
                }
            };
        }).finally(() => {
            this.connectPromise = null;
        });

        return this.connectPromise;
    }

    send(message: ClientMessage): boolean {
        if (
            !this.socket ||
            this.socket.readyState !== WebSocket.OPEN
        ) {
            console.warn("WebSocket is not connected");
            return false;
        }

        this.socket.send(JSON.stringify(message));
        return true;
    }

    subscribe(listener: MessageListener): () => void {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    }

    unsubscribe(listener: MessageListener): void {
        this.listeners.delete(listener);
    }

    disconnect(): void {
        const socket = this.socket;

        this.socket = null;
        this.connectPromise = null;

        if (
            socket &&
            socket.readyState !== WebSocket.CLOSED &&
            socket.readyState !== WebSocket.CLOSING
        ) {
            socket.close();
        }
    }
}

export default new WebSocketService();