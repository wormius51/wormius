window.addEventListener('load', () => {
    setStartingPosition();
    drawBoard();
});

canvas.addEventListener('click', selectCanvas);
canvas.addEventListener('mousedown', event => {
    selectCanvas(event, true);
});
canvas.addEventListener('mousemove', setMouseXY);

const flipButton = document.getElementById("flipBoardButton");
flipButton.addEventListener('click', flipBoard);
const restartButton = document.getElementById("restartButton");
restartButton.addEventListener('click', restart);

var possibleMoves = [];

var myColor = "both";

function setMouseXY (event) {
    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    mouseX = x / squareEdgeLengh -0.5;
    mouseY = y / squareEdgeLengh -0.5;
    drawBoard();
}

function selectCanvas (event, isDrag) {
    if (myColor != "both" && myColor != position.turn)
        return;
    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    let file = Math.floor(x / squareEdgeLengh);
    let rank = Math.floor(y / squareEdgeLengh);
    let xInSquare = x / squareEdgeLengh - file;
    let yInSquare = y / squareEdgeLengh - rank;
    selectSquare(file, rank, xInSquare, yInSquare, isDrag);
}

function selectSquare (file, rank, xInSquare, yInSquare, isDrag) {
    if (flippedBoard) {
        file = boardWidth - 1 - file;
        rank = boardHeight - 1 - rank;
    }
    if (position[rank] && draggedPiece == position.ball && position[rank][file] == position.ball)
        return;
    if (isDrag && position[rank])
        draggedPiece = position[rank][file];
    else
        draggedPiece = undefined;
    let move = possibleMoves.find(m => {
        return ((m.bx == undefined && m.x == file && m.y == rank) || 
        (m.bx == file && m.by == rank)) &&
        (m.xInSquare == undefined || (
        m.xInSquare <= xInSquare &&
        m.xInSquare > xInSquare - 0.5 &&
        m.yInSquare <= yInSquare &&
        m.yInSquare > yInSquare - 0.5))
    });
    if (move) {
        if (!move.ballMoves && !move.promotions) {
            positionPlayMove(position, move);
            kickingPiece = undefined;
            sendMove(move);
        }
    }
    else {
        let ballMove = null;
        let kickMove = possibleMoves.find(m => {
            if (!m.ballMoves)
                return false;
            ballMove = m.ballMoves.find(bm => {
                return bm.bx == file && bm.by == rank;
            });
            return ballMove;
        });
        if (kickMove && !(ballMove.bx == ballMove.sx && ballMove.by == ballMove.sy)) {
            positionPlayMove(position, ballMove);
            kickingPiece = undefined;
            sendMove(ballMove);
        }
    }
    if (move) {
        if (move.bx != undefined)
            position.ball.firstMove = false;
        if (move.ballMoves) {
            possibleMoves = move.ballMoves;
            draggedPiece = position.ball;
            kickingPiece = position[move.sy][move.sx];
        }
        else if (move.promotions)
            possibleMoves = move.promotions;
        else
            possibleMoves = [];
    } else {
        kickingPiece = undefined;
        possibleMoves = getMovesOfPiece(position, file, rank);
    }
    drawBoard();
    updateInfo();
}

function restart() {
    setStartingPosition();
    drawBoard();
    updateInfo();
}