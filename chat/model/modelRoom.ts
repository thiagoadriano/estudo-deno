import { ModelConnect } from "./modelConnect.ts";

export class ModelRoom {
    idRoom: string;
    name: string;
    users: ModelConnect[];
  
    constructor(_idRoom: string, _name: string, _users: ModelConnect[]) {
      this.idRoom = _idRoom;
      this.name = _name;
      this.users = _users;
    }
  }