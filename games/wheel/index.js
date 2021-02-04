const socketer = require('../../scripts/socketer');
const Player = require('./Player');

const namespace = "/wheel";

function start() {
    socketer.addListener(namespace, "add-player", (data, socket, nsp) => {
        let player = join(socket.id, data.wheelOwnerId);
        if (data.wheelOwnerId)
            socket.join(data.wheelOwnerId);
        player.socket = socket;
        socket.emit("you-joined", {player: player.avatar, owner: Player.getAvatarById(data.wheelOwnerId)});
    });

    socketer.addListener(namespace, "disconnect", (data, socket, nsp) => {
        leave(socket.id);
        Player.removePlayerById(socket.id);
    });

    socketer.addListener(namespace, "update-player", (data, socket, nsp) => {
        let player = update(socket.id, data.name, data.message);
        socket.emit("you-updated", player.avatar);
    });

    socketer.addListener(namespace, "select-player", (data, socket, nsp) => {
        let player = Player.getPlayerByAvartarId(data.id);
        if (player)
            player.socket.emit("you-got-selected");
    });

    socketer.addListener(namespace, "spin", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (player)
            nsp.to(player.avatar.id).emit("spin");
    });
}

function join(socketId, wheelOwnerId) {
    let player = Player(socketId, "Guest", wheelOwnerId);
    let owner = Player.getPlayerByAvartarId(wheelOwnerId);
    if (owner) {
        owner.players.push(player);
        owner.socket.emit('player-joined', player.avatar);
    }
    return player;
}

function leave(socketId) {
    let player = Player.getPlayerById(socketId);
    if (!player)
        return;
    player.avatar.connected = false;
    let owner = Player.getPlayerByAvartarId(player.wheelOwnerId);
    if (!owner)
        return;
    owner.players = owner.players.filter(p => {return p.socketId != player.socketId});
    owner.socket.emit('player-left', player.avatar);
}

function update(socketId, name, message) {
    let player = Player.getPlayerById(socketId);
    if (!player)
        return;
    player.avatar.name = name;
    player.avatar.message = message;
    let owner = null;
    if (player.wheelOwnerId)
        owner = Player.getPlayerByAvartarId(player.wheelOwnerId);
    if (owner) {
        owner.socket.emit('player-updated', player.avatar);
    } else if (player.avatar.isOwner) {
        socketer.getNamespace(namespace).to(player.avatar.id).emit('owner-updated', player.avatar);
    }
    return player;
}

module.exports.start = start;