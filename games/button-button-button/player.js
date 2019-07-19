const faker = require('faker');
const uuidv4 = require('uuid/v4');

var players = [];

function Player (socketId ,name) {
    if (!name) name = faker.name.firstName();
    let player = {
        socketId: socketId,
        room: 'lobby',
        avatar: {
            id: uuidv4(),
            name: name,
            connected: true
        },
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
    let avatarId = null;
    players = players.filter(obj => {
        if (obj.socketId == id) {
            avatarId = obj.avatar.id;
            obj.avatar.connected = false;
            return false;
        }
        return true;
    });
    return avatarId;
}

function getAvatarById(id) {
    let player = players.find(element => {
        return element.avatar.id == id;
    });
    return player.avatar;
}

module.exports = Player;
module.exports.getPlayerById = getPlayerById;
module.exports.removePlayerById = removePlayerById;
module.exports.getPlayers = () => {
    return players;
};
module.exports.getAvatarById = getAvatarById;