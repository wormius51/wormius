const uuidv4 = require('uuid/v4');

var rooms = [];
function Room(player) {
    let room = {
        id: uuidv4(),
        players: [player.avatar],
        state: "waiting",
        round: 0,
        targetScore: 100,
        scores: [0, 0, 0],
        buttonNumbers: generateButtonNumbers(),
        choices: [-1, -1, -1]
    };
    rooms.push(room);
    return room;
}

function getRoomById(id) {
    let room = rooms.find(r => {
        return r.id == id;
    });
    return room;
}

function generateButtonNumbers() {
    let numbers = [];
    for (let i = 0; i < 3; i++) {
        numbers.push(24 + (Math.floor(Math.random() * 4) * 6));
    }
    return numbers;
}

function select(player, roomId, index) {
    if (index != 0 && index != 1 && index != 2) return;
    let room = getRoomById(roomId);
    if (!room) return;
    if (room.state != "playing") return;
    let playerIndex = room.players.indexOf(player);
    if (playerIndex == -1) return;
    room.choices[playerIndex] = index;
    if (room.choices.indexOf(-1) == -1) {
        finishRound(room);
    }
    return room;
}

function startRound(room) {
    room.round++;
    room.state = "playing";
    room.buttonNumbers = generateButtonNumbers();
    let dCount = 0;
    for (let i = 0; i < 3; i++) {
        if (room.players[i].connected) {
            room.choices[i] = -1;
        } else {
            room.choices[i] = Math.floor(Math.random() * 3);
            dCount++;
        }
    }
    if (dCount == 3) {
        finishGame(room);
    }
}

function finishRound(room) {
    for (let i = 0; i < 3; i++) {
        let choosers = [];
        for (let j = 0; j < 3; j++) {
            if (room.choices[j] == i) {
                choosers.push(j);
            }
        }
        let value = room.buttonNumbers[i] / choosers.length;
        choosers.forEach(playerIndex => {
            room.scores[playerIndex] += value;
        });
    }
    room.state = "round-end";
    if (room.scores.find(s => {
        return s >= room.targetScore;
    })) {
        finishGame(room);
    }
}

function finishGame(room) {
    room.state = "game-end";
    rooms = rooms.filter(r => {
        return r != room;
    });
}



module.exports = Room;
module.exports.getRoomById = getRoomById;
module.exports.getRooms = () => {
    return rooms;
};
module.exports.select = select;
module.exports.startRound = startRound;