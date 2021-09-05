const aiParams = {
    ballRankWeight: 1,
    materialWeight: 1,
    movesCountWeight: 0.01,
    aiColor: "black",
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
    let moves = getMovesOfPosition(position);
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

function ExecuteAiMove () {
    rollPositionToMove(Infinity);
    if (position.turn != aiParams.aiColor)
        return;
    let posCopy = copyPosition(position);
    let move = aiMove(position);
    move.string = moveString(position, move);
    if (!matchData && isLegalMove(posCopy, move)) {
        moves.push(move);
        rollPositionToMove(Infinity);
        updateInfo();
    }
}