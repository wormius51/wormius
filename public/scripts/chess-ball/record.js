const matchDataString = document.getElementById("matchData").innerHTML;

window.addEventListener('load', () => {
    if (matchDataString)
        decodeMatchString(matchDataString);
});

/**
 * Encodes the data of the match in a string
 */
function matchString () {
    let movesString = "";
    moves.forEach(move => {
        movesString += moveMinString(move) + ",";
    });
    movesString = movesString.substr(0, movesString.length - 1);
    return movesString;
}

function decodeMatchString (string) {
    let movesChars = string.split(",");
    moves = [];
    rollPositionToMove(0);
    movesChars.forEach(s => {
        let move = stringToMove(s);
        move.string = moveString(position, move);
        moves.push(move);
        positionPlayMove(position, move);
    });
    rollPositionToMove(-1);
    updateInfo();
}

function stringToMove (string) {
    if (!string)
        return;
    let code = Base64.toNumber(string) + "";
    let move = {
        sx: code[0] * 1,
        sy: code[1] * 1,
        x: code[2] * 1,
        y: code[3] * 1,
        bx: code[4] == "9" ? undefined : code[4] * 1,
        by: code[5] == "9" ? undefined : code[5] * 1,
        enpassant: code[6] == "1"
    };
    switch (code[7]) {
        case "1":
            move.promotion = "knight";
            break;
        case "2":
            move.promotion = "bishop";
            break;
        case "3":
            move.promotion = "rook";
            break;
        case "4":
            move.promotion = "queen";
            break;
    }
    return move;
}

function moveMinString (move) {
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
    let s = Base64.fromNumber(charCode);
    return s;
}