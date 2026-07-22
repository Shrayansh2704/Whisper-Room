export enum MessageType {
    CONNECTED = "CONNECTED",

    CREATE_ROOM = "CREATE_ROOM",
    ROOM_CREATED = "ROOM_CREATED",

    ROOM_JOINED = "ROOM_JOINED",
    JOIN_ROOM = "JOIN_ROOM",
    
    USER_JOINED = "USER_JOINED",
    USER_LEFT = "USER_LEFT",

    LEAVE_ROOM = "LEAVE_ROOM",
    DESTROY_ROOM = "DESTROY_ROOM",
    
    SEND_MESSAGE = "SEND_MESSAGE",

    ERROR = "ERROR",
}

export interface ClientMessage<T = unknown> {
  type: MessageType;
  payload: T;
}

export interface ServerMessage<T = unknown> {
  type: MessageType;
  payload: T;
}

export interface CreateRoomPayload{
    name : string;
}

export interface JoinRoomPayload{
    roomId : string;
    name : string;
}

export interface UserJoinedPayload {
    id: string;
    name: string;
}
