# Whisper Room Frontend

A real-time chat room frontend built with **React, TypeScript, Vite, and WebSockets**.

Whisper Room allows users to create and join chat rooms, communicate in real time, view participants, and manage users within a room.

---

## Features

- Create a chat room
- Join an existing room using a Room ID
- Real-time messaging
- Real-time participant updates
- Join and leave notifications
- Participant list
- Admin indicator
- Admin-only kick functionality
- Leave room functionality
- System messages
- WebSocket communication
- Responsive dark-themed UI

---

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Lucide React
- WebSocket API

---

## Project Structure

src/
├── components/
│   ├── chat/
│   │   ├── ChatHeader.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ChatMessages.tsx
│   │   ├── MessageBubble.tsx
│   │   └── ParticipantsDialog.tsx
│   │
│   └── ui/
│
├── pages/
│   ├── HomePage.tsx
│   ├── JoinRoomPage.tsx
│   └── ChatRoomPage.tsx
│
├── services/
│   └── websocket.ts
│
├── types/
│   ├── chat.ts
│   └── message.ts
│
├── App.tsx
└── main.tsx

---

## WebSocket Communication

The frontend communicates with the backend using WebSockets.

The WebSocket service handles:

- Establishing connections
- Sending messages
- Receiving server messages
- Managing message listeners
- Handling disconnections

---

## Environment Variables

Create a `.env` file in the frontend project:

VITE_WS_URL=ws://localhost:3000

---

## Installation

npm install

---

## Running the Frontend

npm run dev

---

## Version 1

### Completed

- [x] Room creation
- [x] Room joining
- [x] Real-time messaging
- [x] Participant management
- [x] Join notifications
- [x] Leave notifications
- [x] Admin indicator
- [x] Kick user functionality
- [x] Leave room functionality
- [x] System messages
- [x] WebSocket communication

---

## Version 2

Version 2 will extend Whisper Room with **WebRTC-based voice and video communication**.

### Planned Features

- [ ] WebRTC voice calling
- [ ] WebRTC video calling
- [ ] Multi-user meetings
- [ ] Microphone controls
- [ ] Camera controls
- [ ] Screen sharing
- [ ] Call interface
- [ ] Meeting controls
- [ ] Improved room experience

The existing WebSocket connection will be used as the signaling mechanism for WebRTC.

Planned signaling events:

- `OFFER`
- `ANSWER`
- `ICE_CANDIDATE`

---

## Project Status

**Version 1: Completed**

**Version 2: Planned**

The current version provides real-time text communication using WebSockets. WebRTC-based voice and video communication will be added in Version 2.
