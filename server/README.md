# Whisper Room - Server

Backend server for **Whisper Room**, a real-time chat application built using **Node.js**, **Express**, and **Socket.IO**.

This server manages client connections, room management, and real-time message broadcasting between users.

---

##  Features

- Real-time communication using WebSockets
- Multiple chat rooms
- Room joining support
- Message broadcasting within rooms
- User connection and disconnection handling
- Event-based architecture

---

## Tech Stack

- Node.js
- Express.js
- Socket.IO
- TypeScript

---

## Project Structure

```
src/
│
├── events/
│   ├── connection.ts
│   ├── disconnect.ts
│   ├── message.ts
│   └── rooms.ts
│
├── types/
├── utils/
├── app.ts
├── socket.ts
└── server.ts
```

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Move to the server directory

```bash
cd server
```

Install dependencies

```bash
npm install
```

---

## Running the Server

Development

```bash
npm run dev
```

Production

```bash
npm run build
npm start
```

---

## Socket Events

### Client → Server

| Event | Description |
|-------|-------------|
| `join-room` | Join a chat room |
| `send-message` | Send a message to a room |

### Server → Client

| Event | Description |
|-------|-------------|
| `receive-message` | Receive a new message |
| `user-joined` | A user joined the room |
| `user-left` | A user left the room |

---

## Workflow

```
Client
   │
   ▼
Socket Connection
   │
   ▼
Join Room
   │
   ▼
Send Message
   │
   ▼
Server Broadcasts
   │
   ▼
Users in Same Room Receive Message
```

---

## License

This project is created for learning purposes.