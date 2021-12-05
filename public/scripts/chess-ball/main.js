function chessIsMobile () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

const isEditor = false;

window.addEventListener('load', () => {
    setStartingPosition();
    drawBoard();
    updateInfo();
});

window.addEventListener('touchmove', event => {
    if (draggedPiece)
        event.preventDefault();
}, {passive: false});

canvas.addEventListener('click', selectCanvas);
canvas.addEventListener('mousedown', event => {
    selectCanvas(event, true);
});
canvas.addEventListener('mousemove', setMouseXY);
canvas.addEventListener('touchend', event => {
    event.clientX = event.changedTouches[0].pageX;
    event.clientY = event.changedTouches[0].pageY;
    selectCanvas(event);
});
canvas.addEventListener('touchstart', event => {
    event.clientX = event.changedTouches[0].pageX;
    event.clientY = event.changedTouches[0].pageY;
    setMouseXY(event);
    selectCanvas(event, true);
});
canvas.addEventListener('touchmove', event => {
    event.clientX = event.changedTouches[0].pageX;
    event.clientY = event.changedTouches[0].pageY;
    setMouseXY(event);
});


const flipButton = document.getElementById("flipBoardButton");
flipButton.addEventListener('click', flipBoard);
const restartButton = document.getElementById("restartButton");
restartButton.addEventListener('click', restart);
const editorButton = document.getElementById("editorButton");
editorButton.addEventListener('click', () => {
    window.open(`./chess-ball/editor?pos=${positionFen(position)}`);
});

var possibleMoves = [];

var myColor = "white";

function calculateX (clientX) {
    let offset = offsetofElement(canvas);
    let x = clientX - offset.left;
    if (!chessIsMobile())
        x += window.scrollX;
    return x;
}
function calculateY (clientY) {
    let offset = offsetofElement(canvas);
    let y = clientY - offset.top;
    if (!chessIsMobile())
        y += window.scrollY;
    return y;
}

function setMouseXY (event) {
    let x = calculateX(event.clientX);
    let y = calculateY(event.clientY);
    mouseX = x / squareEdgeLength -0.5;
    mouseY = y / squareEdgeLength -0.5;
    drawBoard();
}

function selectCanvas (event, isDrag) {
    rollPositionToMove(Infinity);
    /*if (myColor != "both" && myColor != position.turn)
        return;*/
    let x = calculateX(event.clientX);
    let y = calculateY(event.clientY);
    let file = Math.floor(x / squareEdgeLength);
    let rank = Math.floor(y / squareEdgeLength);
    let xInSquare = x / squareEdgeLength - file;
    let yInSquare = y / squareEdgeLength - rank;
    selectSquare(file, rank, xInSquare, yInSquare, isDrag);
}

function selectSquare (file, rank, xInSquare, yInSquare, isDrag, isPremove) {
    if (positionResult(position) != "playing")
        return;
    if (flippedBoard && !isPremove) {
        file = boardWidth - 1 - file;
        rank = boardHeight - 1 - rank;
    }
    if (position[rank] && position[rank][file] &&
        draggedPiece && draggedPiece.type == "ball" && position[rank][file].type == "ball")
        return;
    if (isDrag && position[rank])
        draggedPiece = position[rank][file];
    else
        draggedPiece = undefined;
    if (myColor != "both" && myColor != position.turn) {
        setPremove(file, rank, xInSquare, yInSquare, isDrag);
        return;
    } else {
        premoves = [];
    }
    let move = possibleMoves.find(m => {
        return ((m.bx == undefined && m.x == file && m.y == rank) || 
        (m.bx == file && m.by == rank)) &&
        (m.xInSquare == undefined || (
        m.xInSquare <= xInSquare &&
        m.xInSquare > xInSquare - 0.5 &&
        m.yInSquare <= yInSquare &&
        m.yInSquare > yInSquare - 0.5));
    });
    if (move) {
        if (!move.ballMoves && !move.promotions) {
            applyMove(move);
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
            applyMove(ballMove);
        }
    }
    if (move) {
        if (move.ballMoves) {
            possibleMoves = move.ballMoves;
            draggedPiece = position[move.y][move.x];
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

function applyMove (move) {
    move.string = moveString(position, move);
    moves.push(move);
    positionPlayMove(position, move);
    kickingPiece = undefined;
    draggedPiece = undefined;
    mostRecentMove = move;
    if (!matchData && positionResult(position) == "playing") {
        nonBlockAiMove();
    }
    sendMove(move);
}

function restart() {
    moves = [];
    possibleMoves = [];
    mostRecentMove = undefined;
    setStartingPosition();
    drawBoard();
    updateInfo();
}