importScripts(
    "gpu-browser-core.min.js",
);

const boardWidth = 8;
const boardHeight = 8;
const numberBitSize = 32;
const pieceBitSize = 4;
const castlingFlagsBitSize = 3;

const turnFlag = 1;

const castlingFlags = {
    white: {
        short: 1,
        long: 1 << 1
    },
    black: {
        short: 1 << 2,
        long: 1 << 3
    }
};


const piecesNumbers = {
    pawn: 1,
    knight: 2,
    bishop: 3,
    rook: 4,
    queen: 5,
    king: 6,
    ball: 7
}

// Black is 1
const pieceColor = 1 << 3;
const pieceFirstMove = 1 << 4;

function pieceToNumber (piece) {
    let number = piecesNumbers[piece.type];
    if (piece.team == "black")
        number |= pieceColor;
    if (piece.firstMove)
        number |= pieceFirstMove;
    return number;
}


function positionToNumbers (position) {
    let output = [0,0,0,0,0,0,0,0];
    let numberIndex = 0;
    let pieceCount = 0;
    for (let rank = 0; rank < boardHeight; rank++) {
        for (let file = 0; file < boardWidth; file++) {
            const piece = position[rank][file];
            // Subtruacting the length in bits of the previous sections.
            const bitIndex = file + rank * boardWidth - numberIndex * numberBitSize;
            if (piece) {
                output[numberIndex] |= 1 << bitIndex;
                putPiece(output, pieceCount, piece);
                pieceCount++;
            }
            if (bitIndex == (numberBitSize - 1))
                numberIndex++;
        }
    }
    applyFlags(output, position);
    setEnpassant(output, position);
    return output;
}

function putPiece (numbers, pieceCount, piece) {
    const bitIndex = (pieceCount * pieceBitSize) % numberBitSize;
    const numberIndex = 2 + Math.floor(pieceCount * pieceBitSize / numberBitSize);
    const pieceNumber = pieceToNumber(piece);
    numbers[numberIndex] |= pieceNumber << bitIndex;
}

function applyFlags (numbers, position) {
    if (position.castling.white.short)
        setFlag(numbers, castlingFlags.white.short);
    if (position.castling.white.long)
        setFlag(numbers, castlingFlags.white.long);
    if (position.castling.black.short)
        setFlag(numbers, castlingFlags.black.short);
    if (position.castling.black.long)
        setFlag(numbers, castlingFlags.black.long);
}

function setFlag (numbers, flag, on = true) {
    if (on)
        numbers[numbers.length - 1] |= flag;
    else
        numbers[numbers.length - 1] &= ~flag;
}

function setEnpassant (numbers, position) {
    const enpassantFlagPosition = castlingFlagsBitSize + 1;
    const enpassantFlag = 1 << enpassantFlagPosition;
    if (!position.enpassant) {
        numbers[numbers.length - 1] &= ~enpassantFlag;
        return;
    }
    numbers[numbers.length - 1] |= enpassantFlag;
    const enpassantTileIndex = position.enpassant.x + position.enpassant.y * boardWidth;
    // Clear all the bits inside the area of the enpassant tile index.
    numbers[numbers.length - 1] &= ~((boardHeight * boardWidth - 1) << (enpassantFlagPosition + 1));
    numbers[numbers.length - 1] |= enpassantTileIndex << (enpassantFlagPosition + 1);
}

function logPieces (numbers) {
    let numberIndex = 0;
    for (let rank = 0; rank < boardHeight; rank++) {
        for (let file = 0; file < boardWidth; file++) {
            const bitIndex = file + rank * boardWidth - numberIndex * numberBitSize;
            const hasPiece = (numberToUnsigned(numbers[numberIndex]) & (1 << bitIndex)) != 0;
            console.log(`(${file},${rank}) ${hasPiece}`);
            if (bitIndex == (numberBitSize - 1))
                numberIndex++;
        }
    }
}

function testPositionConversion (position) {
    const positionNumbers = positionToNumbers(position);
    console.log(positionNumbers.map(n => {
        return numberToUnsigned(n).toString(2);
    }));
}

function numberToUnsigned (number) {
    return number >>> 0;
}