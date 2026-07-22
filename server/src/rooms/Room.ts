import {User} from "./User.js";

export interface Room{
    id : string;
    adminId: string;
    users : Map<string, User>;
}