const GameObject = require('./gameObject');
const effects = require('./effects');

/**
 * Creates an enemy that shoots lazer beems.
 * @param {Number} x The position.
 * @returns The enemy.
 */
function Looker(x) {
    let looker = GameObject(x, 40, "rgb(169, 156, 190)", "looker", "enemy");
    looker.eye = GameObject(x, 10, "red", "eye", "enemy");
    looker.eye.allwaysUpdate = true;
    looker.eye.dontPhysics = true;
    looker.eyePos = 0;
    looker.left = true;
    looker.state = "look";
    looker.charge = 0;
    looker.onUpdate = () => {
        switch (looker.state) {
            case "look":
                looker.charge++;
                look(looker);
                break;
            case "charge":
                charge(looker);
                break;
            case "fire":
                fire(looker);
                break;
        }
    };
    return looker;
}

function look(looker) {
    if (looker.eyePos <= -12) {
        preperCharge(looker);
        looker.left = false;
    } else if (looker.eyePos >= 12) {
        preperCharge(looker);
        looker.left = true;
    }
    looker.eyePos += (looker.left ? -1 : 1) * 0.2;
    looker.eye.x = looker.x + looker.eyePos;
}

function preperCharge(looker) {
    let chargeSound = GameObject(looker.x);
    chargeSound.sound = "laser_charge.mp3";
    chargeSound.onUpdate = () => {
        chargeSound.hp -= 50;
    }
    if (looker.charge >= 100)
        looker.state = "charge";
    looker.charge = 20;
}

function charge(looker) {
    if (looker.eye.color == "red") {
        looker.eye.color = "orange";
    } else {
        looker.eye.color = "red";
    }
    looker.charge -= 0.2;
    if (looker.charge <= 0) {
        looker.state = "fire";
    }
}

function fire(looker) {
    if (!looker.fireBall) {
        let effect = effects.LaserBeem(looker.x + (looker.left ? 1 : -1) * looker.width);
        effect.owner = looker.id;
        effect.dontPhysics = true;
    } else {
        let fireBall = effects.FireBall(looker.x + (looker.left ? 1 : -1) * looker.width);
        fireBall.acceleration += (looker.left ? 1 : -1) * 0.01;
        fireBall.owner = looker.id;
        fireBall.enemy = true;
    }
    looker.eye.color = "red";
    looker.state = "look";
}

function FireBaller(x) {
    let fireBaller = Looker(x);
    fireBaller.fireBall = true;
    fireBaller.color = "orange";
    fireBaller.name = "fireBaller";
    return fireBaller;
}

function Dasher(x) {
    let dasher = GameObject(x, 10, "rgb(20, 124, 214)", "dasher", "enemy");
    dasher.flame = GameObject(x, 5, "red", "flame", "enemy");
    dasher.ember = GameObject(x, 5, "orange", "flame", "enemy");
    dasher.flame.allwaysUpdate = true;
    dasher.ember.allwaysUpdate = true;
    dasher.flame.dontPhysics = true;
    dasher.ember.dontPhysics = true;
    dasher.startingX = x;
    dasher.left = Math.random() > 0.5;
    dasher.onUpdate = () => {
        if (dasher.x < dasher.startingX - 100) {
            dasher.left = false;
        } else if (dasher.x > dasher.startingX + 100) {
            dasher.left = true;
        }
        dasher.flame.x = dasher.x + (dasher.left ? dasher.width : - dasher.width);
        dasher.ember.x = dasher.flame.x + (dasher.left ? -5 : 5);
        if (Math.abs(dasher.speed) < 0.08) { 
            dasher.acceleration += dasher.left ? -0.0024 : 0.0024;
        } else {
            dasher.left = Math.random() > 0.5;
        }
    };
    dasher.flame.damage = 1;
    dasher.flame.onCollision = other => {
        if (other.type == "player") {
            other.acceleration += (dasher.flame.x > other.x ? -1 : 1) * 0.003;
            other.hp -= dasher.flame.damage;
        }
    };
    dasher.ember.damage = 1.5;
    dasher.ember.onCollision = other => {
        if (other.type == "player") {
            other.acceleration += (dasher.ember.x > other.x ? -1 : 1) * 0.003;
            other.hp -= dasher.ember.damage;
        }
    };
    return dasher;
}

/**
 * Creates an erea where a popuulation of enemies live.
 * @param {Number} x The position.
 * @param {Number} width The width of the erea.
 * @param {String} enemyType The type of enemy.
 * @param {Number} maxPopulation The maximum number of enemies.
 * @param {Number} spawnTime The time it takes a new enemy to spawn.
 * @returns The spawn erea.
 */
function SpawnErea(x, width, enemyType, maxPopulation, spawnTime) {
    if (!x) x = 0;
    if (!width) width = 4000;
    if (!enemyType) enemyType = "Looker";
    if (!maxPopulation) maxPopulation = 4;
    if (!spawnTime) spawnTime = 4000;
    let spawnErea = {
        x: x,
        width: width,
        enemyType: enemyType,
        maxPopulation: maxPopulation,
        population: [],
        spawnTime: spawnTime,
        lastSpawnTime: Date.now(),
        onUpdate: t0 => {
            spawnErea.population = spawnErea.population.filter(enemy => {
                return enemy && !enemy.destroy;
            });
            if (spawnErea.population.length < maxPopulation) {
                if (t0 - spawnErea.lastSpawnTime > spawnErea.spawnTime) {
                    let x = spawnErea.x + spawnErea.width * Math.random();
                    spawnErea.population.push(module.exports[spawnErea.enemyType](x));
                    lastSpawnTime = Date.now();
                }
            }
        }
    };
    return spawnErea;
}

module.exports.Looker = Looker;
module.exports.FireBaller = FireBaller;
module.exports.Dasher = Dasher;
module.exports.SpawnErea = SpawnErea;