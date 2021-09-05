const uuidv4 = require('uuid/v4');

var players = [];

function Player (socket ,name) {
    if (!name) name = "Guest";
    let player = {
        socketId: socket? socket.id : uuidv4(),
        socket: socket,
        room: 'lobby',
        avatar: {
            id: uuidv4(),
            name: name,
            connected: true
        },
    };
    players.push(player);
    socket.emit("player-added", {name: player.name, socketId: socket.id});
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

function updatePlayer(id, data) {
    if (!data || !id)
        return;
    let player = Player.getPlayerById(id);
        if (!player)
            return;
    player.avatar.name = data.name;
}

module.exports = Player;
module.exports.getPlayerById = getPlayerById;
module.exports.removePlayerById = removePlayerById;
module.exports.getPlayers = () => {
    return players;
};
module.exports.countPlayers = () => {
    return players.length;
};
module.exports.getAvatarById = getAvatarById;
module.exports.updatePlayer = updatePlayer;