const socketer = require('../../scripts/socketer');
const Player = require('./player');
const Match = require('./match');

const namespace = "chess-ball";

function start () {
    socketer.addListener(namespace, "add-player", (data, socket, nsp) => {
        Player.removePlayerById(socket.id);
        let player = Player(socket, data);
        nsp.emit("player-count", Player.countPlayers());
        socket.emit("player-added", player.avatar);
    });

    socketer.addListener(namespace, "update-player", (data, socket, nsp) => {
        let player = Player.updatePlayer(socket.id, data);
        if (player && player.match)
            Match.sendData(player.match);
    });

    socketer.addListener(namespace, "reconnect", (data, socket, nsp) => {
        let player = Player.getPlayerById(data);
        if (player) {
            player.socket = socket;
            nsp.emit("player-count", Player.countPlayers());
        }
    });

    socketer.addListener(namespace, "disconnect", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (!player)
            return;
        player.avatar.connected = false;
        Player.removePlayerById(socket.id);
        nsp.emit("player-count", Player.countPlayers());
        if (player.match && (player.match.white == player || player.match.black == player)) {
            let reason = "disconnect " + (player.match.white == player ? "white" : "black");
            Match.endMatch(player.match, reason);
        }
    });

    socketer.addListener(namespace, "resign", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (!player)
            return;
        if (player.match && (player.match.white == player || player.match.black == player)) {
            let reason = "resign " + (player.match.white == player ? "white" : "black");
            Match.endMatch(player.match, reason);
        }
    });

    socketer.addListener(namespace, "offer-draw", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (!player)
            return;
        Match.offerDraw(player);
    });

    socketer.addListener(namespace, "makeMatch", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (!player)
            player = Player(socket);
        Match.cancleRematch(player);
        Match(player, true, data);   
    });

    socketer.addListener(namespace, "join", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (!player)
            player = Player(socket);
        Match.cancleRematch(player);
        Match.join(data, player);
    });

    socketer.addListener(namespace, "rematch", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
            if (player)
                Match.rematch(player);
    });

    socketer.addListener(namespace, "quickMatch", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (!player)
            player = Player(socket);
        else
            Match.cancleRematch(player);
        Match.joinMatchOrStart(player);
    });

    socketer.addListener(namespace, "playMove", (data, socket, nsp) => {
        let player = Player.getPlayerById(socket.id);
        if (player && player.room != "lobby")
            Match.playMove(player, data);
        else
            socket.emit("You are not in a match");
    });
}

module.exports.start = start;