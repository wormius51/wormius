const socketer = require('../../scripts/socketer');
const Player = require('./player');
const Match = require('./match');

const namespace = "chess-ball";

function start () {
    socketer.addListener(namespace, "add-player", (data, socket, nsp) => {
        Player.removePlayerById(socket.id);
        Player(socket, data);
        nsp.emit("player-count", Player.countPlayers());
    });

    socketer.addListener(namespace, "reconnect", (data, socket, nsp) => {
        let player = Player.getPlayerById(data);
        if (player) {
            player.socket = socket;
            socket.emit("player-added", {name: player.name, socketId: socket.id});
        }
    });

    socketer.addListener(namespace, "disconnect", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (!player)
            return;
        Player.removePlayerById(socket.id);
        nsp.emit("player-count", Player.countPlayers());
        if (player.match && (player.match.white == player || player.match.black == player)) {
            let resaon = "disconnect " + (player.match.white == player ? "white" : "black");
            Match.endMatch(player.match, resaon);
        }
    });

    socketer.addListener(namespace, "makeMatch", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (!player)
            player = Player(socket);
        Match(player);
    });

    socketer.addListener(namespace, "join", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (!player)
            player = Player(socket);
        Match.join(data, player);
    });

    socketer.addListener(namespace, "quickMatch", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (!player)
            player = Player(socket);
        else if (player.room != "lobby") {
            socket.emit("deny", "You need to not be in a match");
            return;
        }
        Match.joinMatchOrStart(player);
    });

    socketer.addListener(namespace, "playMove", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (player && player.room != "lobby")
            Match.playMove(player, data);
    });
}

module.exports.start = start;