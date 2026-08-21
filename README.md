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

---

## Architecture

The application follows a client-server architecture.

    React Client
        |
        | WebSocket
        |
        v
    Node.js Server
        |
        +-- WebSocket Server
        +-- Message Handler
        +-- User Manager
        +-- Room Manager

---

## Version 1

The current version focuses on real-time text communication and room management.

### Completed

- Room creation
- Room joining
- Real-time messaging
- Participant management
- Join and leave notifications
- Admin system
- Kick user functionality
- Disconnect handling
- System messages
- WebSocket-based communication

---

# Version 2

Version 2 is planned to extend Whisper Room from a real-time text chat application into a real-time voice and video communication platform.

### Planned Features

- WebRTC voice calling
- WebRTC video calling
- Screen sharing
- Microphone controls
- Camera controls
- Multi-user meetings
- Persistent database
- User authentication
- Message history
- Production deployment

### WebRTC

WebRTC will be used for real-time audio and video communication between participants.

The existing WebSocket architecture will be used as the signaling layer for exchanging WebRTC information such as:

- `OFFER`
- `ANSWER`
- `ICE_CANDIDATE`

The existing room and participant management system will be reused in Version 2.

---

## Version 2 Architecture

    Whisper Room
         |
         | WebSocket
         | Signaling
         |
    +----+----+
    |         |
   User A   User B
    |         |
    +---WebRTC---+
       Audio
       Video

---

## Roadmap

### Version 1

- [x] Room creation
- [x] Room joining
- [x] Real-time messaging
- [x] Participant management
- [x] Join/leave notifications
- [x] Admin system
- [x] Kick user functionality
- [x] Disconnect handling
- [x] System messages

### Version 2

- [ ] WebRTC integration
- [ ] Voice calling
- [ ] Video calling
- [ ] Screen sharing
- [ ] Multi-user meetings
- [ ] Persistent database
- [ ] Authentication
- [ ] Message history
- [ ] Production deployment

---

## Project Status

**Version 1: Completed**

**Version 2: Planned**

The current release provides real-time text communication using WebSockets. Version 2 will introduce WebRTC-based voice and video communication.
