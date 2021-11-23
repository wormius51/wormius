
const matchDataString = document.getElementById("matchData").innerHTML;
const saveGameButton = document.getElementById("saveGameButton");
const loadGameButton = document.getElementById("loadGameButton");

window.addEventListener('load', () => {
    if (matchDataString)
        decodeMatchString(matchDataString);
});

saveGameButton.addEventListener('click', downloadGame);

loadGameButton.addEventListener('click', uploadGame);

/**
 * Encodes the data of the match in a string
 */
function matchString () {
    let movesString = "";
    moves.forEach(move => {
        movesString += moveMinString(move) + ",";
    });
    movesString = movesString.substr(0, movesString.length - 1);
    return movesString + "|" + positionFen(getStartPosition());
}

function decodeMatchString (string) {
    let movesAndPosition = string.split("|");
    let movesChars = movesAndPosition[0].split(",");
    moves = [];
    console.log(movesAndPosition);
    if (movesAndPosition[1])
        startPosition = fenToPosition(movesAndPosition[1]);
    else
        startPosition = defaultStartingPosition;
    rollPositionToMove(-1);
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
    while (code.length < 8)
        code = "0" + code;
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
    if (move.bx != undefined && move.by == undefined)
        move.by = 0;
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
    charCode += move.bx != undefined ? move.bx : 9;
    charCode += move.by != undefined ? move.by : 9;
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

function updateSaveGameField () {
    saveGameField.value = matchString();
}

function downloadGame () {
    let data = {moves: matchString()};
    if (matchData) {
        data.white = matchData.white.name;
        data.black = matchData.black.name;
    } else {
        data.white = nameField.value;
        data.black = "AI";
    }
    let utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    let filename = data.white + "_VS_" + data.black + "_" + utc + ".cb";
    data = JSON.stringify(data);
    let file = new Blob([data], {type: "txt"});
    var a = document.createElement("a"),
            url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
    }, 0); 
}

function uploadGame () {
    let input = document.createElement("input");
    input.type = "file";
    input.click();
    input.addEventListener('change', () => {
        var file = input.files[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                let data = JSON.parse(evt.target.result);
                decodeMatchString(data.moves);
            }
            reader.onerror = function (evt) {
                console.log("error");
            }
        }
    });
}