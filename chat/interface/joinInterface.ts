import { Events } from "../model/modelEvents.ts";

export interface iJoin {
    event: Events,
    userName: string,
    roomName: string,
    roomId: string
}