export function generateRoomId(length = 6): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let roomId = "";

    for (let i = 0; i < length; i++) {
        roomId += chars[Math.floor(Math.random() * chars.length)];
    }

    return roomId;
}