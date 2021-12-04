const canvas = document.getElementById("boardCanvas");
const context = canvas.getContext("2d");

let flippedBoard = false;

const boardHeight = 8;
const boardWidth = 8;

let squareEdgeLength = 70;
let minimumEdgeLength = 30;
const pieceEdgeLength = 320;
const pieceOutlineSize = 0.1;
const moveOptionRadius = 0.4;

let lightSquareColor = "rgb(200, 200, 255)";
let darkSquareColor = "rgb(37, 10, 122)";
let moveOptionColor = "#10fd30d3";
let ballMoveColor = "grey";
let backGroundOpacity = 0.85;

let moveShowColor = "rgba(0,128,0,0.5)";

let draggedPiece = undefined;
let kickingPiece = undefined;
let mouseX = 0;
let mouseY = 0;

let mostRecentMove = undefined;

window.addEventListener('load', resizeBoard);
window.addEventListener('resize', resizeBoard);

function resizeBoard () {
    squareEdgeLength = Math.min(window.innerWidth / 20, window.innerHeight / 10);
    if (squareEdgeLength < minimumEdgeLength)
        squareEdgeLength = minimumEdgeLength;
    setBoardCanvasSize();
    drawBoard();
}

function setBoardCanvasSize () {
    canvas.height = boardHeight * squareEdgeLength;
    canvas.width = boardWidth * squareEdgeLength;
}

function drawSquares () {
    for (let file = 0; file < boardWidth; file++) {
        for (let rank = 0; rank < boardHeight; rank++) {
            context.fillStyle = ((file + rank) % 2 == 0) ? lightSquareColor : darkSquareColor;
            context.fillRect(file * squareEdgeLength, rank * squareEdgeLength,  squareEdgeLength, squareEdgeLength);
        }
    }
}

function drawPiece (piece, file, rank, size, ctx) {
    if (!ctx)
        ctx = context;
    if (!piece)
        return;
    if (!size)
        size = 1;
    if (flippedBoard) {
        file = boardWidth - 1 - file;
        rank = boardHeight - 1 - rank;
    }
    let pieceX = 0;
    let pieceY = (piece.team == "white") ? 0 : 1;
    
    switch (piece.type) {
        case "king":
            pieceX = 0;
            break;
        case "queen":
            pieceX = 1;
            break;
        case "bishop":
            pieceX = 2;
            break;
        case "knight":
            pieceX = 3;
            break;
        case "rook":
            pieceX = 4;
            break;
        case "pawn":
            pieceX = 5;
            break;
        case "ball":
            ctx.drawImage(ballImage, file * squareEdgeLength, rank * squareEdgeLength, squareEdgeLength * size, squareEdgeLength * size);
            return;
        default:
            return;
    }
    if (pieceY == 1)
        drawOutline(pieceX, pieceY, file, rank, size, ctx);
    
    ctx.drawImage(piecesImage, pieceX * pieceEdgeLength, pieceY * pieceEdgeLength, pieceEdgeLength, pieceEdgeLength, file * squareEdgeLength, rank * squareEdgeLength, squareEdgeLength * size, squareEdgeLength * size);
}

function drawOutline (pieceX, pieceY, file, rank, size, ctx) {
    ctx.globalCompositeOperation = "xor";
    let outlineEngeLength = squareEdgeLength * (1 + pieceOutlineSize);
    dx = (squareEdgeLength - outlineEngeLength) * 0.5;
    dy = (squareEdgeLength - outlineEngeLength) * 0.5;
    ctx.drawImage(piecesImage, pieceX * pieceEdgeLength, pieceY * pieceEdgeLength, pieceEdgeLength, pieceEdgeLength, file * squareEdgeLength + dx, rank * squareEdgeLength + dy, outlineEngeLength * size, outlineEngeLength * size);
    ctx.globalCompositeOperation = "source-over";
}

function drawPieces () {
    for (let file = 0; file < boardWidth; file++)
        for (let rank = 0; rank < boardHeight; rank++) {
            if (!position[rank] || !position[rank][file])
                continue;
            if (position[rank][file] != draggedPiece) {
                if (position[rank][file] != kickingPiece)
                    drawPiece(position[rank][file], file, rank);
            } else if (position[rank][file] == position.ball) {
                drawPiece(kickingPiece, file, rank);
            }
            
        }
}

function drawMoveOption (file, rank, color) {
    if (flippedBoard) {
        file = boardWidth - 1 - file;
        rank = boardHeight - 1 - rank;
    }
    context.fillStyle = color? color : moveOptionColor;
    context.beginPath();
    let radius = moveOptionRadius * squareEdgeLength / 2;
    let centerX = (file + 0.5) * squareEdgeLength;
    let centerY = (rank + 0.5) * squareEdgeLength;
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
}

function drawPromotionOptions (x, y, type, team) {
    drawPiece(Piece(team, type), x, y, 0.5);
}

function drawMoveOptions () {
    possibleMoves.forEach(move => {
        if (move.ballMoves) {
            move.ballMoves.forEach(ballMove => {
                if (!(ballMove.bx == ballMove.sx && ballMove.by == ballMove.sy))
                    drawMoveOption(ballMove.bx, ballMove.by, ballMoveColor);
            });
        }
        if (move.promotion) {
            let xd = move.xInSquare;
            let yd = move.yInSquare;
            if (flippedBoard) {
                xd = -xd;
                yd = -yd;
            }
            drawPromotionOptions(move.x + xd, move.y + yd, move.promotion, position.turn);
        }
    });
    possibleMoves.forEach(move => {
        if (move.bx != undefined)
            drawMoveOption(move.bx, move.by, ballMoveColor);
        else if (move.promotion == undefined)
            drawMoveOption(move.x, move.y);
    });
}

function drawMarkSquare (file, rank, color) {
    if (flippedBoard) {
        file = boardWidth - 1 - file;
        rank = boardHeight - 1 - rank;
    }
    context.fillStyle = color;
    context.fillRect(file * squareEdgeLength, rank * squareEdgeLength, squareEdgeLength, squareEdgeLength);
}

function drawShowMove (move) {
    if (!move)
        return;
    drawMarkSquare(move.sx, move.sy, moveShowColor);
    drawMarkSquare(move.x, move.y, moveShowColor);
    if (move.bx != undefined)
        drawMarkSquare(move.bx, move.by, moveShowColor);
}

function drawDraggedPiece () {
    let file = mouseX;
    let rank = mouseY;
    if (flippedBoard) {
        file = boardWidth - 1 - file;
        rank = boardHeight - 1 - rank;
    }
    drawPiece(draggedPiece, file, rank);
}

function drawClydeBackground () {
    context.globalAlpha = backGroundOpacity;
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;
}

function drawBoard () {
    setBoardCanvasSize();
    drawClydeBackground();
    drawShowMove(mostRecentMove);
    drawPieces();
    if (isEditor)
        return;
    drawMoveOptions();
    if (draggedPiece)
        drawDraggedPiece();
}

function flipBoard () {
    flippedBoard = !flippedBoard;
    drawBoard();
}