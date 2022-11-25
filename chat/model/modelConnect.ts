export class ModelConnect {
    idUser: string;
    name: string;
    socket: WebSocket;
  
    constructor(_id: string, _name: string, _ws: WebSocket) {
      this.idUser = _id;
      this.name = _name;
      this.socket = _ws;
    }
  
  }