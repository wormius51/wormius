const roomDiv = document.getElementById("room-div");
const playersTable = document.getElementById("players-table");
const playersH = [undefined,undefined,undefined];
const gameButtons = document.getElementById("buttons-div").children;
const roundNumber = document.getElementById("round-number");
const podium = document.getElementById("podium");
const playersPodiums = document.getElementsByClassName("player-podium");

var currentRoom;
var selected = false;
for (let i = 0; i < 3; i++) {
    playersH[i] = playersTable.children[0].children[i].children[0];
}

function nextRoundCount(num) {
    if (currentRoom.state != "round-end") return;
    if (num == undefined) num = 10;
    roundNumber.innerText = "Next round starts in " + num + " seconds.";
    setTimeout(() => {
        nextRoundCount(num - 1);
    }, 1000);
}

function startGame(room) {
    selected = false;
    currentRoom = room;
    roundNumber.innerText = "Round: " + (room.round + 1);
    document.getElementById("target-score").innerText = room.targetScore;
    roomDiv.style.visibility = "visible";
    for (let i = 0; i < 3; i++) {
        playersH[i].innerText = room.players[i].name + ": 0";
        gameButtons[i].innerText = room.buttonNumbers[i];
    }
}

function select(index) {
    socket.emit('select', {roomId: currentRoom.id, index: index});
    selected = true;
}

socket.on('round-finished', room => {
    selected = false;
    for (let i = 0; i < 3; i++) {
        playersH[i].innerText += " + " + (room.scores[i] - currentRoom.scores[i]);
        let span = document.createElement('span');
        span.innerText = " " + room.players[i].name
        gameButtons[room.choices[i]].appendChild(span);
    }
    currentRoom = room;
    nextRoundCount(10);
});

socket.on('round-started', room => {
    currentRoom = room;
    roundNumber.innerText = "Round: " + (room.round + 1);
    for (let i = 0; i < 3; i++) {
        playersH[i].innerText = room.players[i].name + ": " + room.scores[i];
        gameButtons[i].innerHTML = room.buttonNumbers[i];
    }
});

socket.on('game-finished', room => {
    selected = false;
    podium.style.visibility = "visible";
    let titles = ["1st","2nd","3rd"];
    let playIndexes = [0,1,2];
    playIndexes = playIndexes.sort((a, b) => {
        return room.scores[b] - room.scores[a];
    });
    for (let i = 0; i < 3; i++) {
        let j = playIndexes[i];
        playersPodiums[i].innerText = titles[i] + ". " + room.players[j].name + ": " + room.scores[j];
    }
});

function returnToLobby() {
    podium.style.visibility = "hidden";
    roomDiv.style.visibility = "hidden";
    setLobbyButtons(true);
}

socket.on('time-warning', () => {
    if (!selected) {
        timeWarning(20);
    }
});

function timeWarning(num) {
    if (currentRoom.state != "playing") return;
    if (selected) {
        roundNumber.innerText = "Round: " + (currentRoom.round + 1);
        return;
    }
    if (num == undefined) num = 20;
    if (num <= 10) {
        roundNumber.innerText = "Choosing for you in " + num + " seconds.";
    }
    setTimeout(() => {
        timeWarning(num - 1);
    }, 1000);
}