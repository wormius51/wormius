const resultText = document.getElementById("resaltText");
const title = document.querySelector("title");
const playerCount = document.getElementById("playerCount");
function updateInfo (result) {
    title.innerHTML = "Chess Ball";
    switch (result ? result : positionResult(position)) {
        case "playing":
            resultText.innerHTML = position.turn == "white" ? "White to move" : "Black to move";
            if (matchData) 
                title.innerHTML = position.turn == myColor ? "Your turn" : "Opponents turn";
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
        case "stalemate":
            resultText.innerHTML = "Draw by stalemate";
            break;
    }
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
    let letter =  getLetterOfPiece(position[move.sy][move.sx].type);
    let sourceRankString = "" + (position.length - move.sy);
    let sourceFileString = String.fromCharCode("a".charCodeAt(0) + move.sx);
    let x = move.x;
    let y = move.y;
    let moveType = "";
    if (move.bx != undefined) {
        x = move.bx;
        y = move.by;
        moveType = "o";
    } else if (position[y][x])
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
    return letter + sourceFileString + sourceRankString + moveType + destinationFileString + destinationRankString + promotion + suffix;
}