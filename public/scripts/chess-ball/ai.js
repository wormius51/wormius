const aiParams = {
    ballRankWeight: 1,
    materialWeight: 1,
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
    return aiParams.materialWeight * materialBalance(position) +
    aiParams.ballRankWeight * (-ballRank(position) + position.length / 2);
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

function aiMove (position, depth) {
    if (depth == undefined)
        depth = aiParams.depth;
    let moves = getMovesOfPosition(position);
    let bestMove = moves[0];
    let colorSign = position.turn == "white" ? 1 : -1;
    let bestEval = -Infinity * colorSign;
    moves.forEach(move => {
        let afterEval = 0;
        let afterPosition = positionAfterMove(position, move);
        if (depth > 0 && positionResult(afterPosition) == "playing")
            afterEval = aiMove(afterPosition, depth - 1).eval;
        else
            afterEval = evaluatePosition(afterPosition);
        if (afterEval * colorSign > bestEval * colorSign) {
            bestMove = move;
            bestEval = afterEval;
        }
    });
    bestMove.eval = bestEval;
    return bestMove;
}

function ExecuteAiMove () {
    rollPositionToMove(Infinity);
    let posCopy = copyPosition(position);
    let move = aiMove(position);
    move.string = moveString(position, move);
    if (!matchData && isLegalMove(posCopy, move)) {
        moves.push(move);
        rollPositionToMove(Infinity);
        updateInfo();
    }
}