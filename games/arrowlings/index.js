const socketer = require('../../scripts/socketer');
const Player = require('./player');

const namespace = '/arrowlings';

function start() {
    socketer.addListener(namespace, "add-player", (data, socket, nsp) => {
        Player.removePlayerById(socket.id);
        let player = Player(socket.id, data ? data.name : undefined);
        nsp.to('lobby').emit('player-added', player.avatar);
        socket.join('lobby');
        socket.emit('set-player', player.avatar);
    });

    socketer.addListener(namespace, "disconnect", (data, socket, nsp) => {
        let avatarId = Player.removePlayerById(socket.id);
        if (avatarId != null) {
            nsp.emit('player-removed', avatarId);
        }
    });

    socketer.addListener(namespace, "join-room", (data, socket, nsp) => {
        if (!data) return;
        let player = Player.getPlayerById(socket.id);
        if (!player) return;
        socket.join(data);
        socket.emit('joined-room', data);
        nsp.to(data).emit('player-joined', player.avatar);
    });
}

module.exports.start = start;