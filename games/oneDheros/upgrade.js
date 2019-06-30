const Player = require('./Player');
const effects = require('./effects');

function speedUp(socketId) {
    let player = Player.getPlayerById(socketId);
    if (!player) return;
    if (player.gameObject.upgradePoints > 1) {
        player.gameObject.upgradePoints--;
        player.acceleration += 0.0006;
        player.maxSpeed += 0.02;
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
        return ["shieldRight","pickaboo"];
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
        return ["shieldLeft","pickaboo"];
    }
}

function pickaboo(socketId) {
    let player = Player.getPlayerById(socketId);
    if (!player) return;
    if (player.pickaboo) return;
    if (!player.dashLeft && ! player.dashRight) return;
    if (player.gameObject.upgradePoints > 5) {
        player.gameObject.upgradePoints -= 5;
        player.pickaboo = () => {
            player.gameObject.invisible = !player.gameObject.invisible;
        };
        player.pickaboo.manaCost = 0;
        return [];
    }
}

function shieldRight(socketId) {
    let player = Player.getPlayerById(socketId);
    if (!player) return;
    if (player.shieldRight) return;
    if (!player.dashRight) return;
    if (player.gameObject.upgradePoints > 5) {
        player.gameObject.upgradePoints -= 5;
        player.shieldRight = () => {
            let shield = effects.Shield(player.gameObject.x + player.gameObject.width);
            shield.owner = player.gameObject.id;
        };
        player.shieldRight.manaCost = 2;
        return [];
    }
}

function shieldLeft(socketId) {
    let player = Player.getPlayerById(socketId);
    if (!player) return;
    if (player.shieldLeft) return;
    if (!player.dashLeft) return;
    if (player.gameObject.upgradePoints > 5) {
        player.gameObject.upgradePoints -= 5;
        player.shieldLeft = () => {
            let shield = effects.Shield(player.gameObject.x - player.gameObject.width);
            shield.owner = player.gameObject.id;
        };
        player.shieldLeft.manaCost = 2;
        return [];
    }
}

function sparkRight(socketId) {
    let player = Player.getPlayerById(socketId);
    if (!player) return;
    if (player.sparkRight) return;
    if (player.gameObject.upgradePoints > 5) {
        player.gameObject.upgradePoints -= 5;
        player.sparkRight = () => {
            let spark = effects.Spark(player.gameObject.x + player.gameObject.width);
            spark.acceleration += 0.012;
            spark.owner = player.gameObject.id;
        };
        player.sparkRight.manaCost = 1;
        return ["fireBallRight","heal"];
    }
}

function sparkLeft(socketId) {
    let player = Player.getPlayerById(socketId);
    if (!player) return;
    if (player.sparkLeft) return;
    if (player.gameObject.upgradePoints > 5) {
        player.gameObject.upgradePoints -= 5;
        player.sparkLeft = () => {
            let spark = effects.Spark(player.gameObject.x - player.gameObject.width);
            spark.acceleration -= 0.012;
            spark.owner = player.gameObject.id;
        };
        player.sparkLeft.manaCost = 1;
        return ["fireBallLeft","heal"];
    }
}

function heal(socketId) {
    let player = Player.getPlayerById(socketId);
    if (!player) return;
    if (player.heal) return;
    if (!player.sparkLeft && ! player.sparkRight) return;
    if (player.gameObject.upgradePoints > 10) {
        player.gameObject.upgradePoints -= 10;
        player.heal = () => {
            let healCloud = effects.HealCloud(player.gameObject.x);
            healCloud.owner = player.gameObject.id;
        };
        player.heal.manaCost = 10;
        return [];
    }
}

function fireBallRight(socketId) {
    let player = Player.getPlayerById(socketId);
    if (!player) return;
    if (player.fireBallRight) return;
    if (!player.sparkRight) return;
    if (player.gameObject.upgradePoints > 15) {
        player.gameObject.upgradePoints -= 15;
        player.fireBallRight = () => {
            let fireBall = effects.FireBall(player.gameObject.x + player.gameObject.width);
            fireBall.acceleration += 0.012;
            fireBall.owner = player.gameObject.id;
        };
        player.fireBallRight.manaCost = 10;
        return [];
    }
}

function fireBallLeft(socketId) {
    let player = Player.getPlayerById(socketId);
    if (!player) return;
    if (player.fireBallLeft) return;
    if (!player.sparkLeft) return;
    if (player.gameObject.upgradePoints > 15) {
        player.gameObject.upgradePoints -= 15;
        player.fireBallLeft = () => {
            let fireBall = effects.FireBall(player.gameObject.x - player.gameObject.width);
            fireBall.acceleration -= 0.012;
            fireBall.owner = player.gameObject.id;
        };
        player.fireBallLeft.manaCost = 10;
        return [];
    }
}

module.exports.speedUp = speedUp;
module.exports.hpUp = hpUp;
module.exports.dashRight = dashRight;
module.exports.dashLeft = dashLeft;
module.exports.pickaboo = pickaboo;
module.exports.shieldRight = shieldRight;
module.exports.shieldLeft = shieldLeft;
module.exports.sparkLeft = sparkLeft;
module.exports.sparkRight = sparkRight;
module.exports.heal = heal;
module.exports.fireBallRight = fireBallRight;
module.exports.fireBallLeft = fireBallLeft;