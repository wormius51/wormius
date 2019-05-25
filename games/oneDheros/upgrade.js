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

function sparkRight(socketId) {
    let player = Player.getPlayerById(socketId);
    if (!player) return;
    if (player.sparkRight) return;
    if (player.gameObject.upgradePoints > 5) {
        player.sparkRight = () => {
            let spark = effects.Spark(player.gameObject.x + player.gameObject.width);
            spark.acceleration += 0.2;
            spark.owner = player.gameObject.id;
        }
        player.sparkRight.manaCost = 1;
        return true;
    }
}

function sparkLeft(socketId) {
    let player = Player.getPlayerById(socketId);
    if (!player) return;
    if (player.sparkLeft) return;
    if (player.gameObject.upgradePoints > 5) {
        player.sparkLeft = () => {
            let spark = effects.Spark(player.gameObject.x - player.gameObject.width);
            spark.acceleration -= 0.2;
            spark.owner = player.gameObject.id;
        }
        player.sparkLeft.manaCost = 1;
        return true;
    }
}

module.exports.speedUp = speedUp;
module.exports.hpUp = hpUp;
module.exports.dashLeft = dashLeft;
module.exports.dashRight = dashRight;
module.exports.sparkLeft = sparkLeft;
module.exports.sparkRight = sparkRight;