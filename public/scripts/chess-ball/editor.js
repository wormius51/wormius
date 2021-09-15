function isMobile () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

const isEditor = true;

const piecesCanvas = document.getElementById("piecesCanvas");
const piecesContext = piecesCanvas.getContext("2d");
const posLink = document.getElementById("posLink");
const copyPosLinkButton = document.getElementById("copyPosLinkButton");

const editorPieces = [
    [Piece("white", "pawn"), Piece("black", "pawn")],
    [Piece("white", "knight"), Piece("black", "knight")],
    [Piece("white", "bishop"), Piece("black", "bishop")],
    [Piece("white", "rook"), Piece("black", "rook")],
    [Piece("white", "queen"), Piece("black", "queen")],
    [Piece("white", "king"), Piece("black", "king")],
    [Piece("nan", "ball"), undefined]
];

var editorSelection = undefined;
var editorSelectionColor = "#01a410";

window.addEventListener('load', setUpEditor);

function setUpEditor () {
    startPosition = emptyPosition;
    setStartingPosition();
    position.castling.white = false;
    position.castling.black = false;
    drawPiecesCanvas();
}

function drawPiecesCanvas () {
    piecesCanvas.height = editorPieces.length * squareEdgeLength;
    piecesCanvas.width = editorPieces[0].length * squareEdgeLength;
    piecesContext.clearRect(0, 0, piecesCanvas.width, piecesCanvas.height);
    for (let y = 0; y < editorPieces.length; y++) {
        for (let x = 0; x < editorPieces[x].length; x++) {
            drawPiece(editorPieces[y][x], x, y, 1, piecesContext);
        }
    }
    if (editorSelection) {
        piecesContext.strokeStyle = editorSelectionColor;
        piecesContext.strokeRect(editorSelection.x * squareEdgeLength, editorSelection.y * squareEdgeLength, squareEdgeLength, squareEdgeLength);
    }
}

piecesCanvas.addEventListener('click', selectCanvas);
canvas.addEventListener('click', event => {
    selectCanvas(event, false, canvas);
});
window.addEventListener('resize', drawPiecesCanvas);
copyPosLinkButton.addEventListener('click', () => {
    navigator.clipboard.writeText(posLink.value);
});

function calculateX (clientX, ca) {
    let offset = offsetofElement(ca);
    let x = clientX - offset.left;
    if (!isMobile())
        x += window.scrollX;
    return x;
}
function calculateY (clientY, ca) {
    let offset = offsetofElement(ca);
    let y = clientY - offset.top;
    if (!isMobile())
        y += window.scrollY;
    return y;
}

function setMouseXY (event) {
    let x = calculateX(event.clientX);
    let y = calculateY(event.clientY);
    mouseX = x / squareEdgeLength -0.5;
    mouseY = y / squareEdgeLength -0.5;
}

function selectCanvas (event, isDrag, ca) {
    if (!ca)
        ca = piecesCanvas;
    let x = calculateX(event.clientX, ca);
    let y = calculateY(event.clientY, ca);
    let file = Math.floor(x / squareEdgeLength);
    let rank = Math.floor(y / squareEdgeLength);
    let xInSquare = x / squareEdgeLength - file;
    let yInSquare = y / squareEdgeLength - rank;
    selectSquare(file, rank, xInSquare, yInSquare, isDrag, ca);
}

function selectSquare (file, rank, xInSquare, yInSquare, isDrag, ca) {
    if (ca == piecesCanvas) {
        editorSelection = {x: file, y: rank, piece: editorPieces[rank][file]};
        drawPiecesCanvas();
    } else {
        placePiece(file, rank);
    }
}

function placePiece (file, rank) {
    if (!editorSelection)
        return;
    let piece = copyPiece(editorSelection.piece);
    if (piece && (piece.type == "king" || piece.type == "ball")) {
        for (let y = 0; y < position.length; y++) {
            for (let x = 0; x < position[y].length; x++) {
                if (isTheSamePiece(piece, position[y][x]))
                    position[y][x] = undefined;
            }
        }
    }
    position[rank][file] = piece;
    if (piece && piece.type == "ball")
        position.ball = piece;
    drawBoard();
    setPosLinkValue();
}

function setPosLinkValue () {
    posLink.value = window.location.href;
    posLink.value = posLink.value.replace("/editor", "");
    let fen = positionFen(position);
    fen = encodeURI(fen);
    posLink.value += `?pos=${fen}`;
}