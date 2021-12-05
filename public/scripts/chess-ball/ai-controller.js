
let aiStartTime = 0;

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
    window.dispatchEvent(new Event("my-turn"));
}

function nonBlockAiMove () {
    aiStartTime = Date.now();
    aiWorker.postMessage({
        command: "move",
        position: position
    });
}

aiWorker.onmessage = event => {
    
    if (event.data && event.data.responseType == "move") {
        console.log(`AI eval: ${event.data.move.eval}
        AI move time: ${(Date.now() - aiStartTime) / 1000}`);
        ExecuteAiMove(event.data.move);
    }
};