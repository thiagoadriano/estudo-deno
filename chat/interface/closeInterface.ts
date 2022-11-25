import { Events } from "../model/modelEvents.ts";

export interface iClose {
    event: Events;
    userId: string;
    roomId: string;
    userName: string;
}