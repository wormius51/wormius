const socket = io('/chess-ball');
var matchData = undefined;
const multiplayerButton = document.getElementById("multiplayerButton");
multiplayerButton.addEventListener('click', () => {
    socket.emit("quickMatch");
});

socket.emit('add-player');

socket.on('deny', data => {
    console.log(data);
});

socket.on('matchId', data => {
    console.log("matchId: " + data);
});

socket.on('start', data => {
    myColor = data.youAre;
    matchData = data;
    if ((myColor == "white") == flippedBoard)
        flipBoard();
    restart();
    multiplayerButton.style.visibility = "hidden";
    restartButton.style.visibility = "hidden";
});

socket.on('moves', data => {
    if (!matchData || data.moves.length <= matchData.moves.length)
        return;
    mostRecentMove = data.lastMove;
    matchData.moves.push(data.lastMove);
    positionPlayMove(position, data.lastMove);
    drawBoard();
    updateInfo();
});

function sendMove (move) {
    mostRecentMove = move;
    if (!matchData)
        return;
    matchData.moves.push(move);
    socket.emit('playMove', move);
}

socket.on('end', () => {
    myColor = "both";
    matchData = undefined;
    restartButton.style.visibility = "visible";
    multiplayerButton.style.visibility = "visible";
    updateInfo();
});