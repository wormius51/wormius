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
        player.new = false;
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

    socketer.addListener(namespace, "change-name", (data,socket,nsp) => {
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
            id : player.gameObject.id, 
            message : data
        });
    });

    socketer.addListener(namespace,"use-ability", (data, socket) => {
        if (!data) return;
        let player = Player.getPlayerById(socket.id);
        if (player && player[data]) {
            player[data]();
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
    let gameObjects = GameObject.filterObjects();
    gameObjects.forEach(element => {
        element.update = false;
        element.onUpdate();
        if (element.sound) {
            element.update = true;
        }
        if (element.speed) {
            element.x += element.speed;
            element.update = true;
        }
        if (element.destroy) {
            socketer.getNamespace(namespace).emit('object-removed', GameObject.removeObjectById(element.id));
        } else if (element.new && element.type != "player") {
            element.new = false;
            socketer.getNamespace(namespace).emit('object-added', element);
        } else if (element.update) {
            socketer.getNamespace(namespace).emit('object-updated', element);
        }
    });
}

module.exports.start = start;