const GameObject = require('./gameObject');
const faker = require('faker');

var players = [];

/**
 * Creates and returns a new player.
 * @param {String} socketId 
 * @param {String} name 
 * @param {Number} x 
 * @param {Number} width 
 * @param {String} color 
 */
function Player(socketId, name, x, width, color) {
    if (!name) name = faker.name.firstName();
    if (!width) width = 10;
    if (!color) color = "rgb(" + (Math.random() * 255) + "," + (Math.random() * 255) + "," + (Math.random() * 255) + ")";
    let player = {
        socketId : socketId,
        gameObject : GameObject(x, width, color, name, "player"),
        leftPressed : false,
        rightPressed : false,
        speed : 0.1
    };
    players.push(player);
    return player;
}

function getPlayerById(id) {
    return players.find(obj => {
       return obj.socketId == id; 
    });
}

function removePlayerById(id) {
    let objectId = null;
    players = players.filter(obj => {
        if (obj.socketId == id) {
            objectId = obj.gameObject.id;
            GameObject.removeObjectById(objectId);
            return false;
        }
        return true;
    });
    return objectId;
}

module.exports = Player;
module.exports.getPlayerById = getPlayerById;
module.exports.removePlayerById = removePlayerById;
module.exports.getPlayers = () => {return players;};