let premoves = [];
window.addEventListener('my-turn', playPremoves);
canvas.addEventListener('contextmenu', clearPremoves);

function setPremove (file, rank, xInSquare, yInSquare, isDrag) {
    const action = {
        file: file,
        rank: rank,
        xInSquare: xInSquare,
        yInSquare: yInSquare,
        isDrag: isDrag
    };
    premoves.push(action);
}

function clearPremoves (event) {
    event.preventDefault();
    premoves = [];
    drawBoard();
}

function playPremoves () {
    for (const action of premoves) {
        selectSquare(action.file, action.rank, action.xInSquare, action.yInSquare, action.isDrag, true);
        action.used = true;
    }
    premoves = premoves.filter(action => !action.used);
    possibleMoves = [];
    drawBoard();
}