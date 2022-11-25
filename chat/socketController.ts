import { ModelRoom } from "./model/modelRoom.ts";
import { iJoin } from './interface/joinInterface.ts';
import { ModelConnect } from "./model/modelConnect.ts";
import { Events } from "./model/modelEvents.ts";
import { iMessage } from "./interface/messageInterface.ts";
import { iClose } from "./interface/closeInterface.ts";

export class SocketController {
    private rooms = new Map<string, ModelRoom>();

    roomsList() {
        return this.rooms.values();
    }

    gMessage(event: Events, data: any) {
        return JSON.stringify({...data, event});
    }

    private sendMessage(data: iMessage) {
        if (this.rooms.has(data.roomId)) {
            const room = this.rooms.get(data.roomId);
            const usersSend = room?.users.filter(u => u.idUser !== data.userId);

            usersSend?.forEach(u => u.socket.send(this.gMessage(Events.RECEIVED_MESSAGE, {
                text: data.text,
                userName: data.userName
            })));
        }
    }

    private clearUser(data: iClose) {
        const room = this.rooms.get(data.roomId);
        const idx = room?.users.findIndex(u => u.idUser === data.userId);
        if (!isNaN(Number(idx)) && idx! >= 0) {
            room?.users.at(idx!)?.socket.close();
            room?.users.splice(idx!, 1);
            this.rooms.set(data.roomId, room as ModelRoom);
            room?.users.forEach(u => u.socket.send(this.gMessage(Events.USER_EXIT, {userName: data.userName})));
        }
    }

    message(data: iJoin | iMessage | iClose, socket: WebSocket) {
        switch(data.event) {
            case Events.JOIN: {
                this.newUser(data as iJoin);
                const idUser = this.join(data  as iJoin, socket);
                socket.send(this.gMessage(Events.OPEN_ROOM, {...data, idUser}));
                break;
            }

            case Events.SEND_MESSAGE: {
                this.sendMessage(data as iMessage);
                break;
            }

            case Events.CLOSED_CONNECTION: {
                this.clearUser(data as iClose);
                socket.close();
                break;
            }
        }
    }

    private join(data: iJoin, socket: WebSocket) {
        const idUser = crypto.randomUUID();
        const user = new ModelConnect(idUser, data.userName, socket);
        if (!this.rooms.has(data.roomId)) {
            const newRoom =  new ModelRoom(data.roomId, data.roomName, [user]);
            this.rooms.set(data.roomId, newRoom);
        } else {
            const room = this.rooms.get(data.roomId);
            socket.send(this.gMessage(Events.USERS_IN_ROOM, {users: room?.users.map(u => u.name)}));
            room?.users.push(user);
            this.rooms.set(data.roomId, room as ModelRoom);
        }
        return idUser;
    }

    private newUser(data: iJoin) {
        if (this.rooms.has(data.roomId)) {
            const {userName} = data;
            const room = this.rooms.get(data.roomId);
            room?.users.forEach(u => u.socket.send(this.gMessage(Events.NEW_USER, {userName})));
        }
    }
}