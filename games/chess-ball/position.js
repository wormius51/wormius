
const emptyPosition = [
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]
];

const startPosition = [
    [Piece("black", "rook"), Piece("black", "knight"), Piece("black", "bishop"), Piece("black", "queen"), Piece("black", "king"), Piece("black", "bishop"), Piece("black", "knight"), Piece("black", "rook")],
    [Piece("black", "pawn"), Piece("black", "pawn"), Piece("black", "pawn"), Piece("black", "pawn"), Piece("black", "pawn"), Piece("black", "pawn"), Piece("black", "pawn"), Piece("black", "pawn")],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, Piece("nan", "ball"), undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    [Piece("white", "pawn"), Piece("white", "pawn"), Piece("white", "pawn"), Piece("white", "pawn"), Piece("white", "pawn"), Piece("white", "pawn"), Piece("white", "pawn"), Piece("white", "pawn")],
    [Piece("white", "rook"), Piece("white", "knight"), Piece("white", "bishop"), Piece("white", "queen"), Piece("white", "king"), Piece("white", "bishop"), Piece("white", "knight"), Piece("white", "rook")]
];

startPosition.turn = "white";
startPosition.castling = {white: {short: true, long: true}, black: {short: true, long: true}};
startPosition.ball = startPosition[3][4];

function copyPosition(position) {
    let newPosition = [];
    for (let y = 0; y < position.length; y++) {
        newPosition.push([]);
        for (let x = 0; x < position[y].length; x++) {
            let piece = copyPiece(position[y][x]);
            newPosition[y].push(piece);
            if (piece && piece.type == "ball")
                newPosition.ball = piece;
        }
    }
    newPosition.turn = position.turn;
    if (position.castling) {
        newPosition.castling = {white: {
                short: position.castling.white.short,
                long: position.castling.white.long
            },
            black: {
                short: position.castling.black.short,
                long: position.castling.black.long
            }
        }
    }
    return newPosition;
}

function isTheSamePosition(a, b) {
    for (let y = 0; y < a.length; y++) {
        for (let x = 0; x < a[y].length; x++) {
            if (a[y][x] != b[y][x]) {
                if (!a[y][x] || !b[y][x]) {
                    return false;
                }
                if (a[y][x].team != b[y][x].team || a[y][x].type != b[y][x].type) {
                    return false;
                }
            }
        }
    }
    return true;
}

function numberToFile(num) {
    switch (num) {
        case 0:
            return "a";
        case 1:
            return "b";
        case 2:
            return "c";
        case 3:
            return "d";
        case 4:
            return "e";
        case 5:
            return "f";
        case 6:
            return "g";
        case 7:
            return "h";
    }
}

function positionAfterMove (position, move) {
    let afterPosition = copyPosition(position);
    positionPlayMove(afterPosition, move);
    return afterPosition;
}

function positionPlayMove (position, move) {
    
    let piece = position[move.sy][move.sx];
    position[move.sy][move.sx] = undefined;
    if (move.bx != undefined)
        position[move.by][move.bx] = position.ball;
    position[move.y][move.x] = piece;
    
    if (piece.type == "pawn") {
        let colorSign = (piece.team == "white") ? 1 : -1;
        if (position.enpassant && position.enpassant.x == move.x && position.enpassant.y == move.y)
            position[move.y + colorSign][move.x] = undefined;
        if ((move.sy - move.y) * colorSign > 1)
            position.enpassant = {x: move.x, y: move.y + colorSign, team: piece.team};
        if (move.promotion)
            piece.type = move.promotion;
    } else if (piece.type == "rook") {
        if (move.sx == 0)
            position.castling[piece.team].long = false;
        else
            position.castling[piece.team].short = false;
    } else if (piece.type == "king") {
        position.castling[piece.team].long = false;
        position.castling[piece.team].short = false;
        if (move.x - move.sx == -2) {
            let rook = position[move.y][0]
            position[move.y][move.x + 1] = rook;
            position[move.y][0] = undefined;
        } else if (move.x - move.sx == 2) {
            let rook = position[move.y][position[0].length - 1]
            position[move.y][move.x - 1] = rook;
            position[move.y][position[0].length - 1] = undefined;
        }
    }
    piece.firstMove = false;
    if (position.enpassant && position.turn != position.enpassant.team)
        position.enpassant = undefined;
    position.turn = (position.turn == "white") ? "black" : "white";
}


/**
 * Is this team in check
 */
function isCheck(position, team) {
    for (let y = 0; y < position.length; y++) {
        for (let x = 0; x < position[y].length; x++) {
            if (!position[y][x] || position[y][x].team == team) continue;
            let moves = getMovesOfPiece(position, x, y, true);
            for (let i = 0; i < moves.length; i++) {
                let move = moves[i];
                if (position[move.y][move.x]) {
                    if (position[move.y][move.x].type == "king" && position[move.y][move.x].team == team) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function copyMove (move, copyTo) {
    if (!copyTo) return;
    copyTo.x = move.x;
    copyTo.y = move.y;
    copyTo.sx = move.sx;
    copyTo.sy = move.sy;
    copyTo.bx = move.bx;
    copyTo.by = move.by;
    copyTo.promotion = move.promotion;
}

function isTheSameMove (a, b) {
    return a.x == b.x && a.y == b.y &&
    a.sx == b.sx && a.sy == b.sy &&
    a.bx == b.bx && a.by == b.by &&
    a.promotion == b.promotion;
}

function isSavingMove (position, team, move) {
    let pos = positionAfterMove(position, move)
    return !isCheck(pos, team) || isGoal(pos, team);
}

/**
 * Is this team mated
 */
function isMate (position, team, savingMove) {
    if (!isCheck(position, team)) return false;
    for (let y = 0; y < position.length; y++) {
        for (let x = 0; x < position[y].length; x++) {
            if (!position[y][x] || position[y][x].team != team) continue;
            let moves = getMovesOfPiece(position, x, y);
            for (let i = 0; i < moves.length; i++) {
                let move = moves[i];
                if (move.ballMoves) {
                    for (let i = 0; i < move.ballMoves.length; i++) {
                        if (isSavingMove(position, team, move.ballMoves[i])) {
                            copyMove(move.ballMoves[i], savingMove);
                            return false;
                        }
                    }
                } else if (move.promotions) {
                    for (let i = 0; i < move.promotions.length; i++) {
                        if (isSavingMove(position, team, move.promotions[i])) {
                            copyMove(move.promotions[i], savingMove);
                            return false;
                        }
                    }
                } else if (isSavingMove(position, team, move)) {
                    copyMove(move, savingMove);
                    return false;
                }
            }
        }
    }
    return true;
}

function isStalemate (position) {
    if (isMate(position, position.turn) || isGoal(position, "white") || isGoal(position, "black"))
        return false;
    for (let y = 0; y < position.length; y++) {
        for (let x = 0; x < position[y].length; x++) {
            let moves = getMovesOfPiece(position, x, y);
            if (moves.length > 0)
                return false;
        }
    }
    return true;
}

function isGoal (position, team) {
    let goalRank = (team == "white") ? 0 : (position.length - 1);
    for (let file = 0; file < position[goalRank].length; file++) {
        if (position[goalRank][file] && position[goalRank][file].type == "ball")
            return true;
    }
    return false;
}

function positionResult (position) {
    if (isGoal(position, "white"))
        return "goal white";
    if (isGoal(position, "black"))
        return "goal black";
    let attackingTeam = position.turn == "white" ? "black" : "white";
    if (isMate(position, position.turn))
        return "mate " + attackingTeam;
    if (isStalemate(position))
        return "stalemate";
    return "playing";
}






/**
 * Returns a new chess piece.
 * @param {String} team The team to which this piece belongs.
 * @param {String} type The type of piece.
 */
 function Piece(team, type) {
    let piece = {
        team: team,
        type: type,
        firstMove: true
    };
    return piece;
}

function copyPiece (piece) {
    if (!piece)
        return undefined;
    return {
        team: piece.team,
        type: piece.type,
        firstMove: piece.firstMove
    };
}

/**
 * Returns the legal moves of the piece at position (x,y);
 * @param {Pieces[][]} board 
 * @param {Number} x 
 * @param {Number} y 
 */
 function getMovesOfPiece(board, x, y, ignoreAttacks) {
    if (!board[y] || !board[y][x]) return [];
    if (!pieceMoves[board[y][x].type]) return [];
    if (!ignoreAttacks && board[y][x].team != board.turn) return [];
    let moves = pieceMoves[board[y][x].type](board, x, y, ignoreAttacks);
    moves.forEach(move => {
        move.sx = x;
        move.sy = y;
    });
    addKickMoves(board, moves);
    if (!ignoreAttacks) {
        moves = moves.filter(move => {
            if (!move.ballMoves) {
                let afterPosition = positionAfterMove(board, move);
                let check = isCheck(afterPosition, board[y][x].team);
                return !check;
            }
            move.ballMoves = move.ballMoves.filter(bm => {
                let afterPosition = positionAfterMove(board, bm);
                let check = isCheck(afterPosition, board[y][x].team);
                let goal = isGoal(afterPosition, board[y][x].team);
                return !check || goal;
            });
            return move.ballMoves.length != 0;
        });
    }
    return moves;
}

function addKickMoves (board, moves) {
    let kickMove = moves.find(move => {
        let piece = board[move.y][move.x];
        return piece && piece.type == "ball";
    });
    if (!kickMove)
        return;
    let enpassant = board.enpassant;
    let afterPosition = positionAfterMove(board, kickMove);
    afterPosition.enpassant = enpassant;
    let ballMoves = pieceMoves[board[kickMove.sy][kickMove.sx].type](afterPosition, kickMove.x, kickMove.y, false, true);
    ballMoves = ballMoves.filter(move => {
        return !afterPosition[move.y][move.x];
    });
    board[kickMove.y][kickMove.x].team = "nan";
    kickMove.ballMoves = ballMoves;
    ballMoves.forEach(move => {
        move.bx = move.x;
        move.by = move.y;
        move.x = kickMove.x;
        move.y = kickMove.y;
        move.sx = kickMove.sx;
        move.sy = kickMove.sy;
    });
}

const pieceMoves = {
    king: (board, x, y, ignoreAttacks) => {
        let attackerMoves = [];
        if (!ignoreAttacks) {
            for (let j = 0; j < board.length; j++) {
                for (let i = 0; i < board[j].length; i++) {
                    if (board[j][i] && board[j][i].team != board[y][x].team) {
                        getMovesOfPiece(board, i, j, true).forEach(attackerMove => {
                            attackerMoves.push(attackerMove);
                        });
                    }
                }
            }
        }
        let moves = [];
        let freeXDirections = [0];
        let freeYDirections = [0];
        if (x > 0) freeXDirections.push(-1);
        if (x < board[y].length - 1) freeXDirections.push(1);
        if (y > 0) freeYDirections.push(-1);
        if (y < board.length - 1) freeYDirections.push(1);
        freeXDirections.forEach(dx => {
            freeYDirections.forEach(dy => {
                if (ignoreAttacks) {
                    moves.push({ x: x + dx, y: y + dy });
                } else if (!board[y + dy][x + dx] || board[y + dy][x + dx].team != board[y][x].team) {
                    moves.push({ x: x + dx, y: y + dy });
                }
            });
        });
        
        if (!attackerMoves.find(move => {return move.x == x && move.y == y})) {
            let team = board[y][x].team;
            if (board.castling[team].short &&
                board[y][x + 1] == undefined &&
                board[y][x + 2] == undefined &&
                !attackerMoves.find(move => {
                    return move.y == y && (
                        move.x == x + 1 ||
                        move.x == x + 2
                    )
                }))
                moves.push({x: x + 2, y: y});
            
            if (board.castling[team].long &&
                board[y][x - 1] == undefined &&
                board[y][x - 2] == undefined &&
                board[y][x - 3] == undefined &&
                !attackerMoves.find(move => {
                    return move.y == y && (
                        move.x == x - 1 ||
                        move.x == x - 2
                    )
                }))
                moves.push({x: x - 2, y: y});
        }
        
        return moves;
    },

    queen: (board, x, y, ignoreAttacks) => {
        let moves = pieceMoves.bishop(board, x, y, ignoreAttacks);
        pieceMoves.rook(board, x, y, ignoreAttacks).forEach(move => {
            moves.push(move);
        });
        return moves;
    },

    knight: (board, x, y, ignoreAttacks) => {
        let moves = [];
        let freeXDirections = [];
        let freeYDirections = [];
        if (x > 0) freeXDirections.push(-1);
        if (x > 1) freeXDirections.push(-2);
        if (x < board[y].length - 1) freeXDirections.push(1);
        if (x < board[y].length - 2) freeXDirections.push(2);
        if (y > 0) freeYDirections.push(-1);
        if (y > 1) freeYDirections.push(-2);
        if (y < board.length - 1) freeYDirections.push(1);
        if (y < board.length - 2) freeYDirections.push(2);
        freeXDirections.forEach(dx => {
            freeYDirections.forEach(dy => {
                if (Math.abs(dx) != Math.abs(dy)) {
                    if (ignoreAttacks || !board[y + dy][x + dx] || board[y + dy][x + dx].team != board[y][x].team)
                        moves.push({ x: x + dx, y: y + dy });
                }
            });
        });
        return moves;
    },

    rook: (board, x, y, ignoreAttacks) => {
        let moves = [];
        for (let i = x - 1; i >= 0; i--) {
            if (board[y][i] && !(ignoreAttacks && board[y][i].team != board[y][x].team && board[y][i].type == "king")) {
                if (ignoreAttacks || board[y][i].team != board[y][x].team)
                    moves.push({ x: i, y: y });
                break;
            }
            moves.push({ x: i, y: y });
        }
        for (let i = x + 1; i < board[y].length; i++) {
            if (board[y][i] && !(ignoreAttacks && board[y][i].team != board[y][x].team && board[y][i].type == "king")) {
                if (ignoreAttacks || board[y][i].team != board[y][x].team)
                    moves.push({ x: i, y: y });
                break;
            }
            moves.push({ x: i, y: y });
        }
        for (let i = y - 1; i >= 0; i--) {
            if (board[i][x] && !(ignoreAttacks && board[i][x].team != board[y][x].team && board[i][x].type == "king")) {
                if (ignoreAttacks || board[i][x].team != board[y][x].team)
                    moves.push({ x: x, y: i });
                break;
            }
            moves.push({ x: x, y: i });
        }
        for (let i = y + 1; i < board.length; i++) {
            if (board[i][x] && !(ignoreAttacks && board[i][x].team != board[y][x].team && board[i][x].type == "king")) {
                if (ignoreAttacks || board[i][x].team != board[y][x].team)
                    moves.push({ x: x, y: i });
                break;
            }
            moves.push({ x: x, y: i });
        }
        return moves;
    },

    bishop: (board, x, y, ignoreAttacks) => {
        let moves = [];
        let minLength = Math.min(board.length, board[y].length);
        let dirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        dirs.forEach(dir => {
            for (let i = 1; i < minLength; i++) {
                if (x + i * dir[0] > board[y].length - 1) break;
                if (y + i * dir[1] > board.length - 1) break;
                if (x + i * dir[0] < 0) break;
                if (y + i * dir[1] < 0) break;
                if (board[y + i * dir[1]][x + i * dir[0]] && !(ignoreAttacks && board[y + i * dir[1]][x + i * dir[0]].team != board[y][x].team && board[y + i * dir[1]][x + i * dir[0]].type == "king")) {
                    if (ignoreAttacks || board[y + i * dir[1]][x + i * dir[0]].team != board[y][x].team)
                        moves.push({ x: x + i * dir[0], y: y + i * dir[1] });
                    break;
                }
                moves.push({ x: x + i * dir[0], y: y + i * dir[1] });
            }
        });
        return moves;
    },

    pawn: (board, x, y, ignoreAttacks, isBallMove) => {
        let dir = board[y][x].team == "white" ? -1 : 1;
        let moves = [];
        if (!ignoreAttacks && board[y + dir] && !board[y + dir][x]) {
            moves.push({ x: x, y: y + dir });
            if ((isBallMove ? board.ball.firstMove : board[y][x].firstMove) && board[y + dir * 2] && !board[y + dir * 2][x])
                moves.push({ x: x, y: y + dir * 2 });
        }
        if (x < board[y + dir].length - 1) {
            if (ignoreAttacks || (board[y + dir] && board[y + dir][x + 1] && board[y + dir][x + 1].team != board[y][x].team) || (board.enpassant && board.enpassant.x == x + 1 && board.enpassant.y == y + dir)) {
                moves.push({ x: x + 1, y: y + dir });
            }
        }
        if (x > 0) {
            if (ignoreAttacks || (board[y + dir] && board[y + dir][x - 1] && board[y + dir][x - 1].team != board[y][x].team) || (board.enpassant && board.enpassant.x == x - 1 && board.enpassant.y == y + dir)) {
                moves.push({ x: x - 1, y: y + dir });
            }
        }

        if (!isBallMove && board[y][x].team == "white" ? y == 1 : y == board.length - 2) {
            moves.forEach(move => {
                let promotions = [];
                promotions.push({ x: move.x, y: move.y, promotion: "queen", xInSquare: 0, yInSquare: 0 });
                promotions.push({ x: move.x, y: move.y, promotion: "rook", xInSquare: 0.5, yInSquare: 0 });
                promotions.push({ x: move.x, y: move.y, promotion: "knight", xInSquare: 0, yInSquare: 0.5 });
                promotions.push({ x: move.x, y: move.y, promotion: "bishop", xInSquare: 0.5, yInSquare: 0.5 });
                move.promotions = promotions;
                promotions.forEach(p => {
                    p.sx = x;
                    p.sy = y;
                });
            });
        }
        return moves;
    }
};

function getLetterOfPiece(type) {
    switch (type) {
        case "king":
            return "K";
        case "queen":
            return "Q";
        case "rook":
            return "R";
        case "bishop":
            return "B";
        case "knight":
            return "N";
    }
    return "";
}

function isTheSamePiece(a, b) {
    if (!a) {
        return !b;
    }
    if (!b) {
        return !a;
    }
    return a.team == b.team && a.type == b.type;
}

module.exports.getStartingPosition = () => {
    return copyPosition(startPosition);
}

function isLegalMove (position, move) {
    for (let rank = 0; rank < position.length; rank++) {
        for (let file = 0; file < position[rank].length; file++) {
            let moves = getMovesOfPiece(position, file, rank);
            for (let i = 0; i < moves.length; i++) {
                let pmove = moves[i];
                if (pmove.ballMoves) {
                    for (let j = 0; j < pmove.ballMoves.length; j++) {
                        if (isTheSameMove(pmove.ballMoves[j], move))
                            return true;
                    }
                } else if (pmove.promotions) {
                    for (let j = 0; j < pmove.promotions.length; j++) {
                        if (isTheSameMove(pmove.promotions[j], move))
                            return true;
                    }
                } else { 
                    if (isTheSameMove(pmove, move))
                        return true;
                }
            }
        }
    }
    return false;
}

module.exports.positionPlayMove = positionPlayMove;
module.exports.positionResult = positionResult;
module.exports.isLegalMove = isLegalMove;