importScripts(
    "piece.js",
    "position.js"
);

onmessage = event => {
    switch (event.data.command) {
        case "move":
            postMove(event.data.position, event.data.devideTask);
            break;
        case "depth":
            changeDepth(event.data.depth);
            break;
        case "log":
            console.log("I am here");
            break;
    }
};

async function postMove (position, devideTask) {
    let move = undefined;
    if (devideTask)
        move = await splitMoveTask(position);
    else 
        move = aiMove(position);
    postMessage({
        responseType: "move",
        move: move
    });
}

async function splitMoveTask (position) {
    const moves = getMovesOfPosition(position);
    const workersAndMoves = [];
    for (const move of moves) {
        const worker = new Worker("ai.js");
        workersAndMoves.push({
            worker: worker,
            move: move
        });
        worker.postMessage({
            command: "depth",
            depth: aiParams.depth - 1
        });
        const subPosition = positionAfterMove(position, move);
        worker.postMessage({
            command: "move",
            position: subPosition
        });
    }
    const move = await Promise.all(workersAndMoves.map(subWorkerPromise)).then(moves => {
        let colorSign = position.turn == "white" ? 1 : -1;
        let bestMove = undefined;
        for (const move of moves) {
            if (bestMove == undefined ||
                move.eval * colorSign > bestMove.eval * colorSign)
                bestMove = move;
        }
        return bestMove;
    });
    return move;
}

async function subWorkerPromise (workersAndMove) {
    return new Promise((resolve, reject) => {
        workersAndMove.worker.onmessage = event => {
            workersAndMove.worker.terminate();
            workersAndMove.move.eval = event.data.move.eval;
            resolve(workersAndMove.move);
        };
    });
}

function changeDepth (depth) {
    if (!isNaN(depth))
        aiParams.depth = depth;
}

const aiParams = {
    ballRankWeight: 1,
    materialWeight: 1,
    movesCountWeight: 0.01,
    depth: 2
};

function evaluatePosition (position) {
    let result = positionResult(position);
    switch (result) {
        case "goal white":
        case "mate white":
            return Infinity;
        case "goal black":
        case "mate black":
            return -Infinity;
        case "stalemate":
            return 0;
    }
    let moves = getMovesOfPosition(position);
    return aiParams.materialWeight * materialBalance(position) +
    aiParams.ballRankWeight * (-ballRank(position) + position.length / 2) +
    moves.length * aiParams.movesCountWeight * (position.turn == "white" ? 1 : -1);
}

function materialBalance (position) {
    let balance = 0;
    for (let rank = 0; rank < position.length; rank++) {
        for (let file = 0; file < position[rank].length; file++) {
            let piece = position[rank][file];
            let value = pieceValue(piece);
            if (piece && piece.team == "black")
                value = -value;
            balance += value;
        }
    }
    return balance;
}

function pieceValue (piece) {
    if (!piece)
        return 0;
    switch (piece.type) {
        case "pawn":
            return 1;
        case "knight":
        case "bishop":
            return 3;
        case "rook":
            return 5;
        case "queen":
            return 9;
        default:
            return 0;
    }
}

function ballRank (position) {
    for (let rank = 0; rank < position.length; rank++) {
        for (let file = 0; file < position[rank].length; file++) {
            let piece = position[rank][file];
            if (piece && piece.type == "ball")
                return rank;
        }
    }
}

function aiMove (position, depth, alpha, beta) {
    if (depth == undefined)
        depth = aiParams.depth;
    if (alpha == undefined)
        alpha = -Infinity;
    if (beta == undefined)
        beta = Infinity;
    let moves = getMovesOfPosition(position);//.sort(heuristic(position));//.slice(0, 4);
    let bestMove = moves[0];
    let colorSign = position.turn == "white" ? 1 : -1;
    let bestEval = -Infinity * colorSign;
    for (let i = 0; i < moves.length; i++) {
        let move = moves[i];
        let afterEval = 0;
        let afterPosition = positionAfterMove(position, move);
        if (depth > 0 && positionResult(afterPosition) == "playing")
            afterEval = aiMove(afterPosition, depth - 1, alpha, beta).eval;
        else
            afterEval = evaluatePosition(afterPosition);
        if (afterEval * colorSign > bestEval * colorSign) {
            bestMove = move;
            bestEval = afterEval;
            if (position.turn == "white") {
                alpha = Math.max(bestEval, alpha);
                if (bestEval > beta) {
                    break;
                }
             } else {
                beta = Math.min(bestEval, beta);
                if (bestEval < alpha) {
                    break;
                }
             }
        }
    }
    bestMove.eval = bestEval;
    return bestMove;
}


function heuristic (position) {
    let colorSign = position.turn == "white" ? 1 : -1;
    return (moveA, moveB) => {
        return evaluatePosition(positionAfterMove(position, moveA)) * colorSign > 
            evaluatePosition(positionAfterMove(position, moveB)) * colorSign
            ? -1 : 1;
    };
}