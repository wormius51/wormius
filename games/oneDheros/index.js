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
        let player = Player.getPlayerById(socket.id);
        player.leftPressed = data.leftPressed;
        player.rightPressed = data.rightPressed;
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
        if (element.gameObject.speed) {
            element.gameObject.x += element.gameObject.speed;
            socketer.getNamespace(namespace).emit('object-updated', element.gameObject);
        }
    });
}

module.exports.start = start;