const socketer = require('../../scripts/socketer');
const GameObject = require('./gameObject');
const Player = require('./Player');
const enemies = require('./enemies');
const upgrade = require('./upgrade');

const namespace = "/oneDheros";

var leftSpawn = 10;
var rightSpawn = 90;
var loop;
var frameLength = 1000 / 60;

var t0 = Date.now();
var t1 = Date.now();

var spawEreas = [];

function start() {
    socketer.addListener(namespace, "test", (data, socket) => {
        console.log(data);
        socket.emit('test', "hey");
    });

    socketer.addListener(namespace, "add-player", (data, socket, nsp) => {
        Player.removePlayerById(socket.id);
        let player = Player(socket.id, data ? data.name : undefined, Math.random() * (rightSpawn - leftSpawn) + leftSpawn);
        nsp.emit('object-added', player.gameObject);
        socket.emit('set-id', player.gameObject.id);
        player.new = false;
    });

    socketer.addListener(namespace, "disconnect", (data, socket, nsp) => {
        let objectId = Player.removePlayerById(socket.id);
        if (objectId != null) {
            nsp.emit('object-removed', objectId);
        }
    });

    socketer.addListener(namespace, "keys", (data, socket) => {
        if (!data) return;
        let player = Player.getPlayerById(socket.id);
        if (player) {
            player.leftPressed = data.leftPressed;
            player.rightPressed = data.rightPressed;
        }
    });

    socketer.addListener(namespace, "change-name", (data, socket, nsp) => {
        if (!data) return;
        let player = Player.getPlayerById(socket.id);
        if (player) {
            if (data.length && data.length <= 30) {
                player.gameObject.name = data;
                nsp.emit('object-updated', player.gameObject);
            }
        }
    });

    socketer.addListener(namespace, "say", (data, socket, nsp) => {
        if (!data) return;
        if (!data.length || data.length > 100) return;
        let player = Player.getPlayerById(socket.id);
        if (!player) return;
        nsp.emit('said', {
            id: player.gameObject.id,
            message: data
        });
    });

    socketer.addListener(namespace, "use-ability", (data, socket) => {
        if (!data) return;
        let player = Player.getPlayerById(socket.id);
        if (player && player[data]) {
            try {
                if (!player[data].manaCost || player[data].manaCost <= player.gameObject.mana) {
                    player[data]();
                    if (player[data].manaCost)
                        player.gameObject.mana -= player[data].manaCost;
                }

            } catch (e) {
                console.log(e);
            }
        }
    });

    socketer.addListener(namespace, "upgrade", (data, socket) => {
        if (!data) return;
        if (upgrade[data]) {
            let success = upgrade[data](socket.id);
            if (success) {
                socket.emit('unlock', data);
            }
        }
    });

    spawEreas.push(enemies.SpawnErea(200, 1000, "Dasher"));
    spawEreas.push(enemies.SpawnErea(-200, -1000));

    loop = setTimeout(gameLoop, frameLength);
}

function gameLoop() {
    t0 = Date.now();
    let players = Player.getPlayers();
    players.forEach(element => {
        if (element.leftPressed) {
            if (element.gameObject.speed > - element.maxSpeed) {
                element.gameObject.acceleration -= element.acceleration;

            }
        } else if (element.rightPressed) {
            if (element.gameObject.speed < element.maxSpeed) {
                element.gameObject.acceleration += element.acceleration;
            }
        }
    });
    spawEreas.forEach(spawErea => {
        spawErea.onUpdate(t0);
    });
    physicsUpdate();

    t1 = Date.now();
    let thisFrameLength = t1 - t0;
    loop = setTimeout(gameLoop, frameLength - thisFrameLength);
}

function physicsUpdate() {
    let gameObjects = GameObject.filterObjects();
    checkCollisions(gameObjects);
    gameObjects.forEach(element => {
        if (element.hp <= 0) element.destroy = true;
        element.update = false;
        element.onUpdate();
        if (element.sound) {
            element.update = true;
        }
        if (!element.dontPhysics) {
            if (element.acceleration) {
                element.speed += element.acceleration * frameLength;
                element.acceleration = 0;
            }
            if (element.speed) {
                if (element.speed > 0) {
                    element.speed -= element.drag;
                    if (element.speed < 0) element.speed = 0;
                } else {
                    element.speed += element.drag;
                    if (element.speed > 0) element.speed = 0;
                }
                element.x += element.speed * frameLength;
                element.update = true;
            }
        }
        if (element.destroy) {
            element.onDeath();
        } else if (element.new && element.type != "player") {
            element.new = false;
            socketer.getNamespace(namespace).emit('object-added', element);
        }
    });
    socketer.getNamespace(namespace).emit('objects-updated', 
    gameObjects.filter(element => {
        return element.update || element.allwaysUpdate;
    }));
    socketer.getNamespace(namespace).emit('objects-removed', 
    gameObjects.filter(element => {
        return element.destroy;
    }));
}

function checkCollisions(gameObjects) {
    let colliders = gameObjects.filter(element => {
        return element.onCollision;
    });
    colliders.forEach(gameObject => {
        gameObjects.forEach(other => {
            if (other.id != gameObject.id) {
                if (Math.abs(other.x - gameObject.x) <= gameObject.width / 2) {
                    gameObject.onCollision(other);
                }
            }
        });
    });
}

module.exports.start = start;