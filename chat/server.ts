import {serve} from 'https://deno.land/std@0.165.0/http/mod.ts';

import { Events } from './model/modelEvents.ts';
import { SocketController } from './socketController.ts';


const ctrlSocket = new SocketController();


async function serverFiles(request: Request) {
  const url = new URL(request.url);
  let filePath = decodeURIComponent(url.pathname);

  filePath = filePath === '' || filePath === '/' ? '/index.html' : filePath;

  try {
    const file = await Deno.open(`public${filePath}`, {read: true});
    return new Response(file.readable);
  } catch {
    return new Response('404 Not Found', {status: 404});
  }
}


function webSocket(request: Request) {
  const { socket, response } = Deno.upgradeWebSocket(request);

  socket.addEventListener('open', () => {
    socket.send(ctrlSocket.gMessage(Events.STARTED, {message: "Conexão iniciada!"}));
  });

  socket.addEventListener('message', (evt: MessageEvent) => {
    ctrlSocket.message(JSON.parse(evt.data), socket);
  });

  socket.addEventListener('close', () => {
    console.log("Conexão finalizada!");
  });
  
  socket.addEventListener('error', (e) => {
    console.error("Erro ao realizar a conexão:", e);
  });

  return response;
}

function checkUsersNames(request: Request) {
  let users: string[] = [];

  for(let room of ctrlSocket.roomsList()) {
    users = [...users, ...room.users.map(u => u.name)];
  }

  return new Response(JSON.stringify(users), {headers:{'content-type': 'application/json'}});
}


function handleRequest(req: Request, _conn: any) {
  const url = new URL(req.url);
  if(url.pathname === '/users') {
    return checkUsersNames(req);
  } else if (url.pathname === '/ws') {
    return webSocket(req);
  } else {
    return serverFiles(req);
  }
}

serve(handleRequest, { port: 3000 })
