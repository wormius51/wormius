const boardElement = document.getElementById("board").children[0];
const stateText = document.getElementById("state-text");
const restartButton = document.getElementById("restart-button");
var positions = [];
var board = [];

var playing = false;

function setup () {
    positions = [];
    board = [];
    for (let i = 0; i < boardElement.children.length; i++) {
        let row = boardElement.children[i];
        let boardRow = [];
        for (let j = 0; j < row.children.length; j++) {
            let cell = row.children[j];
            cell.addEventListener('click', () => {
                select(i, j);
            });
            cell.className = "move";
            cell.innerHTML = "O";
            boardRow.push(cell);
        }
        board.push(boardRow);
    }
    addPosition();
    playing = true;
}

function select (i, j) {
    if (!playing)
        return;
    let cell = board[i] [j];
    if (!cell.className) return;
    cell.innerHTML = cell.innerHTML == "X" ? "O" : "X";
    clearMoves();
    markMoves(i, j);
    addPosition();
}

function clearMoves () {
    for (let i = 0; i < board.length; i++) {
        let row = board[i];
        for (let j = 0; j < row.length; j++) {
            let cell = row[j];
            cell.className = "";
        }
    }
}

function markMoves (i, j) {
    let o = board[i][j].innerHTML == "O";
    for (let y = i-1; y <= i+1; y++) {
        if (y < 0 || y >= board.length) 
            continue;
        for (let x = j-1; x <= j+1; x++) {
            if (x < 0 || x >= board[y].length)
                continue;
            if (o && (y == i ? x != j : x == j))
                markMove(y, x);
            if (!o && y != i && x != j)
                markMove(y, x);
        }
    }
}

function markMove(i, j) {
    let position = getPositionString(i, j);
    board[i][j].className = isRepete(position) ? "losing-move" : "move";
}

function getPositionString (y, x) {
    let position = "";
    for (let i = 0; i < board.length; i++) {
        let row = board[i];
        for (let j = 0; j < row.length; j++) {
            let cell = row[j];
            let char = cell.innerHTML;
            if (y == i && x == j)
                char = char == "X" ? "O" : "X";
            position += char;
        }
    }
    return position;
}

function addPosition () {
    let position = "";
    for (let i = 0; i < board.length; i++) {
        let row = board[i];
        for (let j = 0; j < row.length; j++) {
            let cell = row[j];
            position += cell.innerHTML;
        }
    }
    if (isRepete(position)) {
        console.log("repete after " + positions.length + " moves");
        playing = false;
    }
    positions.push(position);
    updateStateText();
}

function isRepete (position) {
    return positions.indexOf(position) != -1;
}

function updateStateText () {
    stateText.innerHTML = `Move ${positions.length}`;
}

setup();

restartButton.addEventListener('click', setup);