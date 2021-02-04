const shortid = require('shortid');

var players = [];

function Player (socketId ,name, wheelOwnerId) {
    if (!name) name = "Guest";
    let isOwner = true;
    if (wheelOwnerId)
        isOwner = false;
    let player = {
        socketId: socketId,
        wheelOwnerId: wheelOwnerId,
        players: [],
        avatar: {
            id: shortid.generate(),
            name: name,
            message: "?",
            color: "#" + Math.floor(Math.random()*16777215).toString(16),
            connected: true,
            isOwner: isOwner
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
    let player = getPlayerByAvartarId(id);
    if (player)
        return player.avatar;
    return null;
}

function getPlayerByAvartarId(id) {
    let player = players.find(element => {
        return element.avatar.id == id;
    });
    return player;
}

module.exports = Player;
module.exports.getPlayerById = getPlayerById;
module.exports.removePlayerById = removePlayerById;
module.exports.getPlayers = () => {
    return players;
};
module.exports.getAvatarById = getAvatarById;
module.exports.getPlayerByAvartarId = getPlayerByAvartarId;