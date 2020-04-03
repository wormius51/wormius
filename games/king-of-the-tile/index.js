const socketer = require('../../scripts/socketer');

const namespace = "/king-of-the-tile";

const lengthX = 10;
const lengthY = 10;
const board = [];

for (let i = 0; i < lengthY; i++) {
    let row = [];
    for (let j = 0; j < lengthX; j++) {
        row.push({});
    }
    board.push(row);
}

function start() {

}

module.exports.start = start;