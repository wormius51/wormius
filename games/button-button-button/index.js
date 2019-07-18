const socketer = require('../../scripts/socketer');
const Player = require('./player');
const Room = require('./room');

const namespace = '/button-button-button';

function start() {
    socketer.addListener(namespace, "add-player", (data, socket, nsp) => {
        Player.removePlayerById(socket.id);
        let player = Player(socket.id, data ? data.name : undefined);
        nsp.emit('player-added', player.avatar);
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

    socketer.addListener(namespace, "set-name", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (!player) return;
        if (data) {
            player.avatar.name = data;
        }
    });

    socketer.addListener(namespace, "create-room", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (!player) return;
        let room = Room(player);
        socket.join(room.id);
        nsp.emit('room-created', room);
    });

    socketer.addListener(namespace, "join-room", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (!player) return;
        let room = Room.getRoomById(data);
        if (!room) return;
        if (room.players.indexOf(player.avatar) != -1) return;
        room.players.push(player.avatar);
        socket.join(room.id);
        nsp.emit('joined-room', { roomId: room.id, player: player.avatar });
        if (room.players.length == 3) {
            room.state = "playing";
            nsp.to(room.id).emit('game-start', room);
        }
    });

    socketer.addListener(namespace, "select", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (!player) return;
        let room = Room.select(player.avatar, data.roomId, data.index);
        if (!room) return;
        if (room.state == "playing") {
            if (room.autoChoose) return;
            nsp.to(room.id).emit('time-warning');
            room.autoChoose = setTimeout(() => {
                if (room.state != "playing") {
                    room.autoChoose = undefined;
                    return;
                }
                for (let i = 0; i < 3; i++) {
                    if (room.choices[i] == -1) {
                        Room.select(room.players[i], room.id, Math.floor(Math.random() * 3));
                    }
                }
                nsp.to(room.id).emit('round-finished', room);
                if (room.state == "round-end") {
                    setTimeout(() => {
                        Room.startRound(room);
                        nsp.to(room.id).emit('round-started', room);
                    }, 10000);
                } else {
                    nsp.to(room.id).emit('game-finished', room);
                    nsp.emit('room-removed', room.id);
                }
                room.autoChoose = undefined;
            }, 20000);
            return;
        }
        if (room.autoChoose) {
            clearTimeout(room.autoChoose);
            room.autoChoose = undefined;
        }
        nsp.to(room.id).emit('round-finished', room);
        if (room.state == "round-end") {
            setTimeout(() => {
                Room.startRound(room);
                nsp.to(room.id).emit('round-started', room);
            }, 10000);
        } else {
            nsp.to(room.id).emit('game-finished', room);
            nsp.emit('room-removed', room.id);
        }
    });
}

module.exports.start = start;