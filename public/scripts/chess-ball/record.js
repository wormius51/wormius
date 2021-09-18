/**
 * Encodes the data of the match in base 64
 */
function matchString () {
    let movesString = "";
    moves.forEach(move => {
        movesString += moveChar(move);
    });
    return movesString;
}

function decodeMatchString (string) {
    let movesChars = movesString.split("");
    moves = [];
    movesChars.forEach(char => {
        let move = charToMove(char);
        moves.push(move);
        positionPlayMove(position, move);
    });
}

function charToMove (char) {
    if (!char)
        return;
    let move = {};
    

    return move;
}

function moveChar (move) {
    if (!move)
        return '';
    let charCode = '';
    charCode += move.sx;
    charCode += move.sy;
    charCode += move.x;
    charCode += move.y;
    charCode += move.bx ? move.bx : 9;
    charCode += move.by ? move.by : 9;
    charCode += move.enpassant ? 1 : 0;
    switch (move.promotion) {
        case "knight":
            charCode += 1;
            break;
        case "bishop":
            charCode += 2;
            break;
        case "rook":
            charCode += 3;
            break;
        case "queen":
            charCode += 4;
            break;
        default:
            charCode += 0;
    }
    charCode = +charCode;
    return String.fromCharCode(charCode);
}