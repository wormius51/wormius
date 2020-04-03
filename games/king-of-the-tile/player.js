const faker = require('faker');

var players = [];

function Player(socketId, name, x, color) {
    if (!name) name = faker.name.firstName();
    if (!color) color = "rgb(" + (Math.random() * 255) + "," + (Math.random() * 255) + "," + (Math.random() * 255) + ")";

    let player = {

    };

    players.push(player);
    return player;
}