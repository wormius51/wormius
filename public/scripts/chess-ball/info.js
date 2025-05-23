const resultText = document.getElementById("resaltText");
const title = document.querySelector("title");
const playerCount = document.getElementById("playerCount");
const movesDiv = document.getElementById("movesDiv");
const movesTable = document.getElementById("movesTable");
const whiteClock = document.getElementById("whiteClock");
const blackClock = document.getElementById("blackClock");

let isFreeScrolling = false;
let currentMoveIndex = 0;

movesDiv.addEventListener('scroll', event => {
    let scrollValue = movesDiv.scrollHeight - Math.floor(movesDiv.scrollTop);
    isFreeScrolling = scrollValue != movesDiv.clientHeight && scrollValue != movesDiv.clientHeight + 1;
});

let moves = [];

function updateInfo (result) {
    if (matchEnd)
        return;
    title.innerHTML = "Chess Ball";
    switch (result ? result : positionResult(position)) {
        case "playing":
            resultText.innerHTML = position.turn == "white" ? "White to move" : "Black to move";
            if (matchData) {
                namesText.innerText = matchData.white.name + " VS " + matchData.black.name;
                title.innerHTML = position.turn == myColor ? "Your turn" : "Opponents turn";
                if (!myColor)
                    title.innerText = matchData.white.name + " VS " + matchData.black.name;
            }
            break;
        case "goal white":
            resultText.innerHTML = "White wins by goal";
            break;
        case "goal black":
            resultText.innerHTML = "Black wins by goal";
            break;
        case "mate white":
            resultText.innerHTML = "White wins by checkmate";
            break;
        case "mate black":
            resultText.innerHTML = "Black wins by checkmate";
            break;
        case "disconnect white":
            resultText.innerHTML = "Black wins by disconnection";
            break;
        case "disconnect black":
            resultText.innerHTML = "White wins by disconnection";
            break;
        case "resign white":
            resultText.innerHTML = "Black wins by resignation";
            break;
        case "resign black":
            resultText.innerHTML = "White wins by resignation";
            break;
        case "timeout white":
            resultText.innerHTML = "Black wins by timeout";
            break;
        case "timeout black":
            resultText.innerHTML = "White wins by timeout";
            break;
        case "stalemate":
            resultText.innerHTML = "Draw by stalemate";
        case "draw agreement":
            resultText.innerHTML = "Draw by agreement";
            break;
        case "repetition":
            resultText.innerHTML = "Draw by repetition";
            break;
    }
    updateMovesDiv();
    updateClocksInfo();
}

socket.on('player-count', data => {
    playerCount.innerHTML = data + " players online";
});

function getLetterOfPiece(type) {
    switch (type) {
        case "king":
            return "K";
        case "queen":
            return "Q";
        case "rook":
            return "R";
        case "bishop":
            return "B";
        case "knight":
            return "N";
    }
    return "";
}

function moveString (position, move) {
    let letter = getLetterOfPiece(position[move.sy][move.sx].type);
    let finalSourceRankString = "";
    let finalSourceFileString = "";
    let sourceRankString = "" + (position.length - move.sy);
    let sourceFileString = String.fromCharCode("a".charCodeAt(0) + move.sx);
    let x = move.x;
    let y = move.y;
    let moveType = "";
    if (move.bx != undefined) {
        x = move.bx;
        y = move.by;
        moveType = "o";
    } else if ((position[y] && position[y][x]) || move.enpassant)
        moveType = "x";
    let destinationRankString = "" + (position.length - y);
    let destinationFileString = String.fromCharCode("a".charCodeAt(0) + x);
    let suffix = "";
    let afterPosition = positionAfterMove(position, move);
    if (isCheck(afterPosition)) {
        suffix = "+";
        if (isMate(afterPosition))
            suffix = "#";
    }
    if (isGoal(afterPosition, position.turn))
        suffix = "#";
    else if (isGoal(afterPosition, afterPosition.turn))
        suffix = "-#";
    let promotion = "";
    if (move.promotion)
        promotion = "=" + getLetterOfPiece(move.promotion);
    if (letter) {
        for (let y = 0; y < position.length; y++) {
            for (let x = 0; x < position[y].length; x++) {
                let moves = getMovesOfPiece(position, x, y);
                moves.forEach(m => {
                    if (!isTheSameMove(m, move) && 
                        position[move.sy][move.sx].type ==
                        position[m.sy][m.sx].type &&
                        move.x == m.x &&
                        move.y == m.y &&
                        !(move.sx == m.sx &&
                        move.sy == m.sy)) {
                        if (move.sx == m.sx)
                            finalSourceRankString = sourceRankString;
                        else
                            finalSourceFileString = sourceFileString;
                    }
                });
            }
        }
    } else if (moveType) {
        finalSourceFileString = sourceFileString;
    }
    if (!move.castling && position[move.sy][move.sx].type == "king") {
        if (move.x - move.sx > 1)
            move.castling = "O-O";
        else if (move.x - move.sx < -1)
            move.castling = "O-O-O";
    }
    if (move.castling) {
        letter = move.castling;
        finalSourceFileString = "";
        finalSourceRankString = "";
        moveType = "";
        destinationFileString = "";
        destinationRankString = "";
    }
    return letter + finalSourceFileString + finalSourceRankString + moveType + destinationFileString + destinationRankString + promotion + suffix;
}

function updateMovesDiv () {
    movesTable.innerHTML = "";
    for (let i = 0; i < moves.length; i++) {
        let tr = undefined;
        if (i % 2 == 0) {
            tr = document.createElement("TR");
            let td = document.createElement("TD");
            td.innerHTML = (1 + i / 2) + ".";
            tr.appendChild(td);
            movesTable.appendChild(tr);
        } else {
            tr = movesTable.children[(i - 1) / 2];
        }
        let td = document.createElement("TD");
        let span = document.createElement("SPAN");
        span.innerHTML = moves[i].string;
        span.className = "moveSpan";
        td.appendChild(span);
        tr.appendChild(td);
        span.id = i;
        span.addEventListener('click', () => {
            rollPositionToMove(span.id);
        });
    }
    if (!isFreeScrolling) {
        movesDiv.scrollTop = movesDiv.scrollHeight;
        isFreeScrolling = false;
    }
}

function rollPositionToMove (moveIndex) {
    currentMoveIndex = moveIndex;
    mostRecentMove = undefined;
    setStartingPosition();
    if (moveIndex != Infinity)
        possibleMoves = [];
    else
        currentMoveIndex = moves.length;
    if (currentMoveIndex < 0)
        currentMoveIndex = -1;
    else if (currentMoveIndex > moves.length - 1)
        currentMoveIndex = moves.length - 1;
    for (let i = 0; i <= moveIndex; i++) {
        if (!moves[i])
            break;
        positionPlayMove(position, moves[i]);
        mostRecentMove = moves[i];
    }
    drawBoard();
}

function scrollMoves (down) {
    if (down)
        rollPositionToMove(currentMoveIndex + 1);
    else
        rollPositionToMove(currentMoveIndex - 1);
}

window.addEventListener('keydown', event => {
    switch (event.key) {
        case "ArrowRight":
            scrollMoves(true);
            break;
        case "ArrowLeft":
            scrollMoves(false);
            break;
        case "ArrowUp":
            rollPositionToMove(-1);
            break;
        case "ArrowDown":
            rollPositionToMove(Infinity);
            break;
    }
});

canvas.addEventListener('mousewheel', event => {
    event.preventDefault();
    scrollMoves(event.deltaY > 0);
});

function updateClocksInfo () {
    if (!matchData || matchEnd)
        return;
    updateClock(clock);
    whiteClock.innerHTML = millisecondsToTimeString(clock.white.time);
    blackClock.innerHTML = millisecondsToTimeString(clock.black.time);
    whiteClock.className = clock.turn == "white" ? "active-clock" : "clock";
    blackClock.className = clock.turn == "black" ? "active-clock" : "clock";
    if (clock.white.time <= 0 || clock.black.time <= 0)
        socket.emit("check-clock");
}

const updateClockInterval = setInterval(updateClocksInfo, 100);