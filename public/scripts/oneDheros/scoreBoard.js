
const scoreBoardCanvases = document.getElementsByClassName("score-board");
const scoreBoards = [scoreBoardCanvases[0].getContext("2d"),scoreBoardCanvases[1].getContext("2d")];


scoreBoards[0].font = "bold 15px Arial";
scoreBoards[1].font = "bold 15px Arial";
var scoreHeight = 15;
var scoreXOffset = 4;

function getPlayers () {
    if (!gameObjects) return [];
    let players = gameObjects.filter(element => {
        return element.type == "player";
    });
    players.sort((a,b) => {
        return a.level > b.level ? -1 : 1;
    });
    return players;
}

function drawPlayerScore(canvasIndex, y, player) {
    let color = "black";
    if (!y) y = 0;
    if (player.color) color = player.color;
    scoreBoards[canvasIndex].fillStyle = color;
    scoreBoards[canvasIndex].fillText(player.name + " : Level " + Math.floor(player.level), scoreXOffset , y);
}

function clearScoreBoards() {
    scoreBoards[0].clearRect(0, 0, scoreBoardCanvases[0].width, scoreBoardCanvases[0].height);
    scoreBoards[1].clearRect(0, 0, scoreBoardCanvases[1].width, scoreBoardCanvases[1].height);
}

function drawPlayersScores() {
    let players = getPlayers();
    clearScoreBoards();
    let numberOfScores = players.length < 10 ? players.length : 10;
    for (let i = 0; i < numberOfScores; i++) {
        let canvasIndex = i < 5 ? 0 : 1;
        drawPlayerScore(canvasIndex,(i % 5 + 1) * scoreHeight, players[i]);
    }
}

setInterval(drawPlayersScores,1000);