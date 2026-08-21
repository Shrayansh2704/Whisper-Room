# Whisper Room

A real-time chat room application built with **React, TypeScript, Node.js, and WebSockets**.

Whisper Room allows users to create and join chat rooms, communicate in real time, view room participants, manage room administration, and kick users when necessary.

The project focuses on understanding **real-time communication, WebSocket architecture, room management, and event-driven application design**.

---

## Features

### Room Management

- Create a new chat room
- Join an existing room using a Room ID
- Leave a room
- Automatically manage room membership
- Automatically assign a new admin when the current admin leaves
- Handle disconnected users

### Real-Time Chat

- Send and receive messages instantly
- Messages are broadcast to all participants in the room
- Unique message IDs using UUIDs
- Real-time user join notifications
- Real-time user leave notifications
- System messages for important room events

### Participant Management

- View all participants in a room
- Display the current room admin
- Real-time participant updates
- Admin-only user kicking
- Notify the kicked user
- Notify remaining participants when a user is kicked

### WebSocket Communication

The application uses WebSockets for real-time communication between clients and the server.

Communication is based on typed message events such as:

- `CREATE_ROOM`
- `JOIN_ROOM`
- `LEAVE_ROOM`
- `SEND_MESSAGE`
- `KICK_USER`
- `USER_JOINED`
- `USER_LEFT`
- `MESSAGE_RECEIVED`
- `ADMIN_CHANGED`
- `USER_KICKED`

---

## Tech Stack

### Frontend

- React
- TypeScript
- React Router
- Tailwind CSS
- Lucide React
- WebSocket API

### Backend

- Node.js
- TypeScript
- WebSocket (`ws`)
- HTTP Server

### Architecture

The application follows a client-server architecture:

```text
┌─────────────────────┐
│      React Client   │
│                     │
│  Chat UI            │
│  Room UI            │
│  Participant UI     │
└──────────┬──────────┘
           │
           │ WebSocket
           │
           ▼
┌─────────────────────┐
│    Node.js Server   │
│                     │
│ WebSocket Server    │
│ Message Handler     │
│ User Manager        │
│ Room Manager        │
└─────────────────────┘
