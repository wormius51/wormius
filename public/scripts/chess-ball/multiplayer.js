const socket = io('/chess-ball');
var matchData = undefined;
const offlineUI = document.getElementById("offlineUI");
const multiplayerUI = document.getElementById("multiplayerUI");
const randomMatchButton = document.getElementById("randomMatchButton");
const rematchButton = document.getElementById("rematchButton");
const friendMatchButton = document.getElementById("friendMatchButton");
const fromPositionButton = document.getElementById("fromPositionButton")
const matchLinkField = document.getElementById("matchLink");
const copyMatchLinkButton = document.getElementById("copyMatchLinkButton");
const matchLinkDiv = document.getElementById("matchLinkDiv");
const linkMatchId = document.getElementById("matchId").innerHTML;

const nameField = document.getElementById("nameField");
const matchInfoDiv = document.getElementById("matchInfoDiv");
const namesText = document.getElementById("namesText");

const resignButton = document.getElementById("resignButton");
const offerDrawButton = document.getElementById("offerDrawButton");

window.addEventListener('load', () => {
    loadCookie();
    nameField.value = cookie.name;
    socket.emit('add-player', cookie.name);
});

nameField.addEventListener('change', updatePlayer);

resignButton.addEventListener('click', () => {
    if (confirm("Are you sure you want to resign?")) {
        socket.emit("resign");
    }
});

offerDrawButton.addEventListener('click', () => {
    socket.emit("offer-draw");
});

function updatePlayer () {
    cookie.name = nameField.value;
    socket.emit("update-player", cookie);
    saveCookie();
}

copyMatchLinkButton.addEventListener('click', () => {
    navigator.clipboard.writeText(matchLinkField.value);
});

randomMatchButton.addEventListener('click', () => {
    socket.emit("quickMatch");
});

rematchButton.addEventListener('click', () => {
    socket.emit("rematch");
});

friendMatchButton.addEventListener('click', () => {
    socket.emit("makeMatch", {timeControl: timeControl});
    matchLinkDiv.style.display = "block";
});

fromPositionButton.addEventListener('click', () => {
    socket.emit("makeMatch", {fen: positionFen(position), timeControl: timeControl});
    matchLinkDiv.style.display = "block";
});

socket.on("player-added", () => {
    if (linkMatchId)
        socket.emit("join", linkMatchId);
});

socket.on('deny', data => {
    console.log(data);
});

socket.on('matchId', data => {
    matchLinkField.value = window.location.href;
    matchLinkField.value = matchLinkField.value.replace(/\?.*/, "");
    matchLinkField.value += "?mi=" + data
    navigator.clipboard.writeText(matchLinkField.value);
    console.log("matchId: " + data);
});

socket.on('start', data => {
    startPosition = data.startFen ? fenToPosition(data.startFen) : defaultStartingPosition;
    myColor = data.youAre;
    matchData = data;
    if ((myColor == "white") == flippedBoard)
        flipBoard();
    restart();
    offlineUI.style.display = "none";
    multiplayerUI.style.display = "block";
    matchLinkDiv.style.display = "none";
    matchInfoDiv.style.display = "block";
    if (!myColor) {
        moves = matchData.moves;
        rollPositionToMove(Infinity);
    }
    if (data.clock)
        clock = data.clock;
    else
        startClock(clock);
    updateInfo();
});

socket.on("updateMatch", data => {
    matchData = data;
    updateInfo();
});

socket.on('moves', data => {
    if (data.clock)
        clock = data.clock;
    else
        pushClock(clock);
    if (!matchData || data.moves.length <= matchData.moves.length)
        return;
    mostRecentMove = data.lastMove;
    if (!myColor) {
        matchData.moves = data.moves;
        moves = data.moves;
    } else {
        matchData.moves = data.moves;
        moves = matchData.moves;
    }
    rollPositionToMove(Infinity);
    drawBoard();  
    updateInfo();
    if (position.turn == myColor)
        window.dispatchEvent(new Event("my-turn"));
});

function sendMove (move) {
    if (!matchData || !myColor)
        return;
    socket.emit('playMove', move);
    offerDrawButton.innerHTML = "Offer Draw";
}

socket.on('end', result => {
    myColor = "both";
    offlineUI.style.display = "block";
    multiplayerUI.style.display = "none";
    matchInfoDiv.style.display = "none";
    matchLinkField.value = "";
    offerDrawButton.innerHTML = "Offer Draw";
    updateInfo(result);
});

socket.on('position', data => {
    console.log(data);
});

socket.on('draw-offer', () => {
    offerDrawButton.innerHTML = "Accept Draw";
});