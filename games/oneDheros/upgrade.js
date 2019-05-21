const Player = require('./Player');
const effects = require('./effects');

function speedUp(socketId) {
    let player = Player.getPlayerById(socketId);
    if (!player) return;
    if (player.gameObject.upgradePoints > 1) {
        player.gameObject.upgradePoints--;
        player.acceleration += 0.01;
        player.maxSpeed = player.acceleration * 2;
    }
}

function hpUp(socketId) {
    let player = Player.getPlayerById(socketId);
    if (!player) return;
    if (player.gameObject.upgradePoints > 1) {
        player.gameObject.upgradePoints--;
        player.gameObject.hp++;
    }
}

function dashLeft(socketId) {
    let player = Player.getPlayerById(socketId);
    if (!player) return;
    if (player.dashLeft) return;
    if (player.gameObject.upgradePoints > 10) {
        player.gameObject.upgradePoints -= 10;
        player.dashLeft = () => {
            if (Math.abs(player.gameObject.speed) <= player.maxSpeed * 2) player.gameObject.acceleration = -player.acceleration * 10;
            let boost = effects.Boost(player.gameObject.x + player.gameObject.width);
            boost.acceleration = player.acceleration;
        };
        return true;
    }
}

function dashRight(socketId) {
    let player = Player.getPlayerById(socketId);
    if (!player) return;
    if (player.dashRight) return;
    if (player.gameObject.upgradePoints > 10) {
        player.gameObject.upgradePoints -= 10;
        player.dashRight = () => {
            if (Math.abs(player.gameObject.speed) <= player.maxSpeed * 2) player.gameObject.acceleration = player.acceleration * 10;
            let boost = effects.Boost(player.gameObject.x - player.gameObject.width);
            boost.acceleration = -player.acceleration;
        };
        return true;
    }
}

module.exports.speedUp = speedUp;
module.exports.hpUp = hpUp;
module.exports.dashLeft = dashLeft;
module.exports.dashRight = dashRight;