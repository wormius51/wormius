const socket = io('/chess-ball');
var matchData = undefined;
const offlineUI = document.getElementById("offlineUI");
const randomMatchButton = document.getElementById("randomMatchButton");
const friendMatchButton = document.getElementById("friendMatchButton");
const matchLinkField = document.getElementById("matchLink");
const copyMatchLinkButton = document.getElementById("copyMatchLinkButton");
const matchLinkDiv = document.getElementById("matchLinkDiv");
const linkMatchId = document.getElementById("matchId").innerHTML;

const nameField = document.getElementById("nameField");

window.addEventListener('load', () => {
    loadCookie();
    socket.emit('add-player', cookie.name);
});

nameField.addEventListener('change', updatePlayer);

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

friendMatchButton.addEventListener('click', () => {
    socket.emit("makeMatch");
    matchLinkDiv.style.visibility = "visible";
});

socket.on("player-added", avatar => {
    if (linkMatchId)
        socket.emit("join", linkMatchId);
});

socket.on('deny', data => {
    console.log(data);
});

socket.on('matchId', data => {
    matchLinkField.value = window.location.href + "/" + data;
    matchLinkField.value = matchLinkField.value.replace("/" + linkMatchId, "");
    navigator.clipboard.writeText(matchLinkField.value);
    console.log("matchId: " + data);
});

socket.on('start', data => {
    myColor = data.youAre;
    matchData = data;
    if ((myColor == "white") == flippedBoard)
        flipBoard();
    restart();
    offlineUI.style.visibility = "hidden";
    matchLinkDiv.style.visibility = "hidden";
    if (!myColor) {
        moves = matchData.moves;
        rollPositionToMove(Infinity);
        updateInfo();
    }
});

socket.on('moves', data => {
    if (!matchData || data.moves.length <= matchData.moves.length)
        return;
    mostRecentMove = data.lastMove;
    if (!myColor) {
        matchData.moves = data.moves;
        moves = data.moves;
    } else {
        matchData.moves = data.moves;
        moves = matchData.moves;
        mostRecentMove = data.lastMove;
        mostRecentMove.string = moveString(position, mostRecentMove);
    }
    rollPositionToMove(Infinity);
    drawBoard();
    updateInfo();
});

function sendMove (move) {
    if (!matchData || !myColor)
        return;
    socket.emit('playMove', move);
}

socket.on('end', result => {
    myColor = "both";
    matchData = undefined;
    offlineUI.style.visibility = "visible";
    matchLinkField.value = "";
    updateInfo(result);
});

socket.on('position', data => {
    console.log(data);
});