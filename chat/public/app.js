let user = {
  id: null,
  name: null,
  roomId: null,
  roomName: null
};

let Events = {
  JOIN: 'JOIN',
  SEND: 'SEND',
  OPEN_ROOM: 'OPENROOM',
  STARTED: 'STARTED',
  NEW_USER: 'NEW_USER',
  SEND_MESSAGE: 'SEND_MESSAGE',
  RECEIVED_MESSAGE: 'RECEIVED_MESSAGE',
  USERS_IN_ROOM: 'USERS_IN_ROOM',
  CLOSED_CONNECTION: 'CLOSED_CONNECTION',
  USER_EXIT: 'USER_EXIT'
};

const ROOMS = [
  {id: '213ABC', name: 'Sala 1'},
  {id: 'AEF3121', name: 'Sala 2'},
  {id: 'N67Byq3', name: 'Sala 3'},
  {id: 'SMKS31w', name: 'Sala 4'},
];

$(() => {
  let socket;

  const $room = $('#containerRoom');
  const $listRooms = $("#listRooms");
  const $containerMessages = $('#containerMessages');
  const $formLogin = $('#chooseRoom');
  const $listUsers = $('#users');
  const $messages = $('#messages');
  const $formMessage = $('#formMessage');
  const $roomName = $('#roomName');
  const $closeRoom = $('#closeRoom');

  async function nameInUse(name) {
    try {
      const listNames = await fetch('http://localhost:3000/users').then(res => res.json());
      return listNames.includes(name);
    } catch(e) {
      return true;
    }
  } 

  function insertUser(name, isActive = false) {
    $listUsers.append($(`<li class="list-group-item ${isActive && 'active'}">${name}</li>`));
  }

  function openRoom(data) {
    user.id = data.idUser;
    user.name = data.userName;
    user.roomId = data.roomId;
    user.roomName = data.roomName;
    $roomName.text(user.roomName);
    insertUser(user.name, true);
    $room.fadeOut('fast');
    $containerMessages.fadeIn('slow');
  }

  function newUser(data) {
    insertUser(data.userName);
  }

  function insertMessage(text, name, isMine = false) {
    const txt = $(`<p>${text}</p>`);
    const li = $('<li/>');
    const div = $('<div/>');

    if (name) {
      const pn = $(`<p class="user">${name}</p>`);
      div.append(pn);
    }

    if (isMine) {
      li.addClass('mine');
    }

    div.append(txt);
    li.append(div);
    $messages.append(li);
  }

  function receivedMsg(data) {
    insertMessage(data.text, data.userName);
  }

  function exitUser(data) {
    $listUsers.children().each((idx, el) => {
      const $li = $(el);
      if ($li.text() === data.userName) {
        $li.remove();
        return;
      }
    });
  }

  
  const onMsg = (evt) => {
    let data = JSON.parse(evt.data);
    
    switch(data.event) {
      case Events.STARTED:
        console.log(data.message);
        break;
        
      case Events.OPEN_ROOM:
        openRoom(data);
        break;

      case Events.NEW_USER:
        newUser(data);
        break;

      case Events.RECEIVED_MESSAGE:
        receivedMsg(data);
        break;

      case Events.USERS_IN_ROOM:
        data.users.forEach(u => insertUser(u));
        break;

      case Events.USER_EXIT:
        exitUser(data);
        break;
    }
    
  };

  const onClose = () => {
    socket?.send(JSON.stringify({
      event: Events.CLOSED_CONNECTION,
      userId: user.id,
      roomId: user.roomId,
      userName: user.name
    }));

    socket?.close();

    socket = null;

    user.id = null;
    user.name = null;
    user.roomId = null;
    user.roomName = null;

    $room.show();
    $containerMessages.hide();
    $listUsers.empty();
    $messages.empty();

    console.log('Conexão finalizada com o servidor!');
  };

  const onError = (evt) => {
    console.error(evt);
  };
  
  const initSocket = () => {
    return new Promise(resolve => {
      socket = new WebSocket('ws://localhost:3000/ws');
      socket.addEventListener('open', (evt) => resolve(evt) && console.log('Conexão aberta com o servidor!'));
      socket.addEventListener('message', onMsg);
      socket.addEventListener('close', onClose);
      socket.addEventListener('error', onError);
    });    
  };

  $formLogin.submit(async (evt) => {
    evt.preventDefault();
    let room = ROOMS.find(r => r.id === evt.currentTarget.rooms.value);
    
    let data = {
      event: Events.JOIN,
      userName: evt.currentTarget.nome.value,
      roomName: room.name,
      roomId: room.id
    };
    if (!(await nameInUse(data.userName))) {
      evt.currentTarget.nome.value = '';
      evt.currentTarget.rooms.checked = false;
      await initSocket();
      socket.send(JSON.stringify(data));
    } else {
      alert('Nome de usuário já em uso. Tente outro');
    }
  });

  $formMessage.submit((evt) => {
    evt.preventDefault();
    const text = evt.currentTarget.txtMsg.value.trim();
    if (text) {
      insertMessage(text, null, true);
      socket.send(JSON.stringify({
        event: Events.SEND_MESSAGE,
        userId: user.id,
        userName: user.name,
        roomId: user.roomId,
        text
      }));
      evt.currentTarget.txtMsg.value = '';
    }
  });

  $closeRoom.on('click', onClose);

  window.addEventListener('unload', onClose);
  
  ROOMS.forEach(r => {
    let ipt = $(`<input type="radio" class="form-check-input m-1" id="${r.id}" name="rooms" value="${r.id}" required>`);
    let label = $(`<label class="form-check-label" for="${r.id}">${r.name}</label>`);
    let li = $('<li class="list-group-item"></li>');
    li.append(ipt);
    li.append(label);
    $listRooms.append(li);
  });

  $room.show();
  $containerMessages.hide();
});