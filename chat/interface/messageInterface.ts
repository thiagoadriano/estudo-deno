import { Events } from "../model/modelEvents.ts";

export interface iMessage {
    event: Events,
    userId: string,
    userName: string,
    roomId: string,
    text: string
}