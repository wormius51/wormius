const socket = io('/button-button-button');
const playersOnlineCounter = document.getElementById("players-online");
const roomsTable = document.getElementById("rooms-table");
const nameInput = document.getElementById("name-input");
var numberOfPlayers = 0;
var me = {};

function changeNumberOfPlayers(num) {
    numberOfPlayers += num;
    playersOnlineCounter.innerHTML = "players online: " + numberOfPlayers;
}

function getNumberOfPlayers() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            changeNumberOfPlayers(JSON.parse(this.response).num);
            socket.emit('add-player');
        }
    };
    xhttp.open("GET", "/button-button-button/getNumberOfPlayers", true);
    xhttp.send();
}

function getRooms() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let rooms = JSON.parse(this.response);
            rooms.forEach(room => {
                showRoom(room);
            });
        }
    };
    xhttp.open("GET", "/button-button-button/getRooms", true);
    xhttp.send();
}

getNumberOfPlayers();
getRooms();

socket.on('set-player', data => {
    me = data;
    document.getElementById("name-input").value = me.name;
});

socket.on('player-added', data => {
    changeNumberOfPlayers(1);
});

socket.on('player-removed', data => {
    changeNumberOfPlayers(-1);
});

nameInput.addEventListener('keyup', () => {
    socket.emit('set-name', nameInput.value);
});

function createRoom() {
    socket.emit('create-room');
    setLobbyButtons(false);
}

socket.on('room-created', data => {
    showRoom(data);
});

socket.on('room-removed', data => {
    let tr = document.getElementById(data);
    if (tr) {
        tr.remove();
    }
});

function showRoom(room) {
    let tds = [];
    room.players.forEach(player => {
        let td = document.createElement('td');
        td.innerText = player.name;
        td.className = "player";
        tds.push(td);
    });
    let tr = document.createElement('tr');
    if (room.players.length < 3 &&
        !room.players.find(p => {
            return p.id == me.id;
        })) {

        let joinButton = document.createElement('button');
        joinButton.innerText = "Join";
        joinButton.onclick = () => {
            joinRoom(room.id);
        };
        joinButton.className = "lobby";
        tr.appendChild(joinButton);
    }
    tds.forEach(td => {
        tr.appendChild(td);
    });
    tr.id = room.id;
    roomsTable.appendChild(tr);
}

function joinRoom(roomId) {
    socket.emit('join-room', roomId);
    setLobbyButtons(false);
}

function setLobbyButtons(inLobby) {
    let v = inLobby ? "visible" : "hidden";
    let buttons = document.getElementsByClassName("lobby");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.visibility = v;
    }
}

socket.on('joined-room', data => {
    let tr = document.getElementById(data.roomId);
    if (!tr) return;
    let td = document.createElement('td');
    td.className = "player";
    td.innerText = data.player.name;
    tr.appendChild(td);
    if (tr.childElementCount > 3) {
        tr.children[0].remove();
    }
});

socket.on('game-start', data => {
    startGame(data);
});