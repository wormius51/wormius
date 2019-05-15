const socketer = require('../../scripts/socketer');
const GameObject = require('./gameObject');
const Player = require('./Player');

const namespace = "/oneDheros";

var leftSpawn = 10;
var rightSpawn = 90;
var loop;

function start() {
    socketer.addListener(namespace, "test", (data, socket) => {
        console.log(data);
        socket.emit('test', "hey");
    });

    socketer.addListener(namespace, "add-player", (data, socket, nsp) => {
        let player = Player(socket.id, data ? data.name : undefined, Math.random() * (rightSpawn - leftSpawn) + leftSpawn);
        nsp.emit('object-added', player.gameObject);
        socket.emit('set-id', player.gameObject.id);
    });

    socketer.addListener(namespace, "disconnect", (data, socket, nsp) => {
        let objectId = Player.removePlayerById(socket.id);
        if (objectId != null) {
            nsp.emit('object-removed', objectId);
        }
    });

    socketer.addListener(namespace, "keys", (data,socket) => {
        if (!data) return;
        let player = Player.getPlayerById(socket.id);
        if (player) {
            player.leftPressed = data.leftPressed;
            player.rightPressed = data.rightPressed;
        }
    });

    socketer.addListener(namespace, "change-name", (data,socket) => {
        if (!data) return;
        let player = Player.getPlayerById(socket.id);
        if (player) {
            player.gameObject.name = data;
            socketer.getNamespace(namespace).emit('object-updated', player.gameObject);
        }
    });

    loop = setInterval(gameLoop,5);
}

function gameLoop() {
    let players = Player.getPlayers();
    players.forEach(element => {
        if (element.leftPressed) {
            element.gameObject.speed = -element.speed;
        } else if (element.rightPressed) {
            element.gameObject.speed = element.speed;
        } else {
            element.gameObject.speed = 0;
        }
    });

    physicsUpdate();
}

function physicsUpdate() {
    let gameObjects = GameObject.getGameObjects();
    gameObjects.forEach(element => {
        if (element.speed) {
            element.x += element.speed;
            socketer.getNamespace(namespace).emit('object-updated', element);
        }
    });
}

module.exports.start = start;