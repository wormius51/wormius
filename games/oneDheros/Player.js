const GameObject = require('./gameObject');
const faker = require('faker');
const effects = require('./effects');

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
        maxSpeed : 0.2,
        acceleration : 0.1,
        punchLeft : () => {
            let effect = effects.DamageEffect(player.gameObject.x - player.gameObject.width);
            effect.owner = player.gameObject.id;
        },
        punchRight : () => {
            let effect = effects.DamageEffect(player.gameObject.x + player.gameObject.width);
            effect.owner = player.gameObject.id;
        }
    };
    player.gameObject.level = 1;
    player.gameObject.upgradePoints = 0;
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
            let g = GameObject.getObjectById(objectId);
            if (g) g.destroy = true;
            return false;
        }
        return true;
    });
    return objectId;
}

module.exports = Player;
module.exports.getPlayerById = getPlayerById;
module.exports.removePlayerById = removePlayerById;
module.exports.getPlayers = () => {
    players = players.filter(p => {
        return p.gameObject && !p.gameObject.destroy;
    });
    return players;
};