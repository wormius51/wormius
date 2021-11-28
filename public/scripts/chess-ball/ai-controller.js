
const aiWorker = new Worker("/scripts/chess-ball/ai.js");

function ExecuteAiMove (move) {
    if (matchData)
        return;
    rollPositionToMove(Infinity);
    let posCopy = copyPosition(position);
    if (!isLegalMove(posCopy, move))
        return;
    move.string = moveString(position, move);
    moves.push(move);
    rollPositionToMove(Infinity);
    updateInfo();
    mostRecentMove = move;
    drawBoard();
}

function nonBlockAiMove () {
    aiWorker.postMessage({
        command: "move",
        position: position
    });
}

aiWorker.onmessage = event => {
    if (event.data && event.data.responseType == "move") {
        ExecuteAiMove(event.data.move);
    }
};