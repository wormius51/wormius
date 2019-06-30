const GameObject = require('./gameObject');

function Effect(x, width, color, name) {
    if (!name) name = "effect";
    if (!width) width = 10;
    if (!color) color = "white";
    let gameObject = GameObject(x, width, color, name, "effect");
    return gameObject;
}

function DamageEffect(x, width) {
    if (!width) width = 10;
    let effect = Effect(x, width);
    effect.opacity = 1;
    effect.r = 255;
    effect.g = 255;
    effect.b = 255;
    effect.enemy = false;
    effect.damage = 1;
    effect.onUpdate = () => {
        effect.update = true;
        effect.color = "rgba(" + effect.r + "," + effect.g + "," + effect.b + "," + effect.opacity + ")";
        effect.opacity -= 0.02;
        if (effect.opacity <= 0) effect.destroy = true;
    };
    effect.onCollision = other => {
        if (other.id != effect.owner) {
            if (other.type == "player") {
                other.acceleration += (effect.x > other.x ? -1 : 1) * 0.003;
                if (effect.enemy) {
                    other.hp -= effect.damage;
                } else if (other.pvp) {
                    let playerObj = GameObject.getObjectById(effect.owner);
                    let parent = playerObj;
                    while (parent) {
                        playerObj = parent;
                        parent = GameObject.getObjectById(parent.owner);
                    }
                    if (playerObj && playerObj.pvp) {
                        other.hp -= effect.damage;
                        playerObj.level += 0.01;
                        playerObj.update = true;
                        playerObj.upgradePoints += 0.01;
                        playerObj.startPvp();
                    }
                }
            } else if (other.type == "enemy" && !effect.enemy) {
                other.hp -= effect.damage;
                let playerObj = GameObject.getObjectById(effect.owner);
                if (playerObj) {
                    playerObj.level += 0.01;
                    playerObj.update = true;
                    playerObj.upgradePoints += 0.01;
                }
            }
        }
    };
    effect.sound = "kick" + Math.floor(Math.random() * 4 + 1) + ".mp3";
    return effect;
}

function LaserBeem(x, width) {
    if (!width) width = 40;
    let beem = DamageEffect(x, width);
    beem.g = 0;
    beem.b = 0;
    beem.r = 255;
    beem.color = "red";
    beem.enemy = true;
    beem.sound = "laser_kaboom.mp3";
    return beem;
}

function Boost(x, width) {
    if (!width) width = 10;
    let boost = DamageEffect(x, width);
    boost.g = 0;
    boost.r = 0;
    boost.color = "blue";
    boost.onCollision = () => { };
    return boost;
}

function Shield(x, width) {
    if (!width) width = 7;
    let shield = Boost(x, width);
    shield.onCollision = other => {
        if (other && other.type == "effect") {
            other.destroy = true;
        }
    }
    return shield;
}

function HealCloud(x) {
    let healCloud = Boost(x, 0);
    healCloud.color = "green";
    healCloud.b = 0;
    healCloud.r = 0;
    healCloud.g = 255;
    healCloud.sound = undefined;
    healCloud.onUpdate = () => {
        healCloud.update = true;
        healCloud.color = "rgba(" + healCloud.r + "," + healCloud.g + "," + healCloud.b + "," + healCloud.opacity + ")";
        healCloud.opacity -= 0.02;
        healCloud.width = (1 - healCloud.opacity) * 20;
        if (healCloud.opacity <= 0) healCloud.destroy = true;
    };
    healCloud.onCollision = other => {
        if (other.type == "player" && other.hp < 100) {
            other.hp += healCloud.damage;
            if (other.hp > 100) other.hp = 100;
        }
    };
    return healCloud;
}

function Spark(x, width) {
    if (!width) width = 5;
    let spark = DamageEffect(x, width);
    spark.b = 0;
    spark.color = "yellow";
    spark.sound = "laser_kaboom.mp3";
    return spark;
}

function FireBall(x, width) {
    if (!width) width = 10;
    let fireBall = DamageEffect(x, width);
    fireBall.b = 0;
    fireBall.g = 0;
    fireBall.color = "red";
    fireBall.drag = 0.001
    fireBall.onUpdate = () => {
        fireBall.update = true;
        fireBall.color = "rgba(" + fireBall.r + "," + fireBall.g + "," + fireBall.b + "," + fireBall.opacity + ")";
        fireBall.opacity -= 0.02;
        if (fireBall.opacity <= 0) fireBall.destroy = true;
        if (!fireBall.lastSpark) {
            fireBall.lastSpark = Date.now();
            let spark = Spark(fireBall.x);
            spark.owner = fireBall.owner;
            spark.enemy = fireBall.enemy;
        } else {
            if (Date.now() - fireBall.lastSpark >= 20) {
                fireBall.lastSpark = Date.now();
                let spark = Spark(fireBall.x);
                spark.owner = fireBall.owner;
                spark.enemy = fireBall.enemy;
            }
        }
    };
    return fireBall;
}

module.exports.Effect = Effect;
module.exports.DamageEffect = DamageEffect;
module.exports.LaserBeem = LaserBeem;
module.exports.Boost = Boost;
module.exports.Shield = Shield;
module.exports.HealCloud = HealCloud;
module.exports.Spark = Spark;
module.exports.FireBall = FireBall;