const shortid = require('shortid');
const position = require('./position');
const Clock = require('./clock'); 

var matches = [];

function Match (player, private, data) {
    let fen = undefined;
    let timeControl = undefined;
    if (data) {
        fen = data.fen;
        timeControl = data.timeControl;
    }
    let match = {timeControl: timeControl};
    if ((player.lastColor == undefined && Math.random() > 0.5) ||
        player.lastColor == "black")
        match.white = player;
    else 
        match.black = player;
    match.moves = [];
    match.id = shortid.generate();
    match.position = fen ? position.fenToPosition(fen) : position.getStartingPosition();
    if (fen)
        match.startFen = fen;
    match.spectators = [];
    match.state = "looking";
    match.private = private;
    match.clock = timeControl ? 
    Clock(timeControl.time, timeControl.time, timeControl.increment, timeControl.increment)
    : Clock();
    matches.push(match);
    player.room = match.id;
    player.match = match;
    player.socket.emit("matchId", match.id);
    return match;
}

function rematch (player) {
    if (!player.pastMatch)
        return;
    let playerColor = player == player.pastMatch.white ? "white" : "black";
    let opponentColor = playerColor == "white" ? "black" : "white";
    player.pastMatch[playerColor + " rematch"] = true;
    if (player.pastMatch[opponentColor + " rematch"]) {
        let newMatch = Match(player, true, {fen: player.pastMatch.startFen, timeControl: player.pastMatch.timeControl});
        joinMatch(newMatch, player.pastMatch[opponentColor]);
    }
}

function cancleRematch (player) {
    if (!player.pastMatch)
        return;
    let playerColor = player == player.pastMatch.white ? "white" : "black";
    player.pastMatch[playerColor + " rematch"] = false;
}

function getMatchById (id) {
    return matches.find(m => m.id == id);
}

function joinById (matchId, player) {
    if (!player) {
        console.log("No player");
        return;
    }
    let match = getMatchById(matchId);
    joinMatch(match, player);
}

function joinMatch (match, player) {
    if (!match)
        return;
    if (match.white == player || match.black == player) {
        player.socket.emit("looking", match.id);
        return;
    }
    if (!match) {
        player.socket.emit("deny", "Match not found");
        return;
    }
    if (match.white == undefined)
        match.white = player;
    else if (match.black == undefined)
        match.black = player;
    if (match.state == "looking")
        startMatch(match);
    else
        spectate(match, player);
    player.room = match.id;
    player.match = match;
}

function spectate (match, player) {
    match.spectators.push(player);
    let avatars = [];
    match.spectators.forEach(s => {
        avatars.push(s.avatar);
    });
    match.white.socket.emit("spectators", avatars);
    match.black.socket.emit("spectators", avatars);
    match.spectators.forEach(spectator => {
        spectator.socket.emit("spectators", avatars);
    });
    let data = dataForSending(match);
    player.socket.emit("start", data);
}

function startMatch (match) {
    Clock.startClock(match.clock, match.position.turn);
    match.white.lastColor = "white";
    match.black.lastColor = "black";
    match.state = "playing";
    let data = dataForSending(match);
    data.youAre = "white";
    match.white.socket.emit("start", data);
    data.youAre = "black";
    match.black.socket.emit("start", data);
}

function endMatch (match, reason) {
    match.state = "finished";
    if (match.white) {
        match.white.room = "lobby";
        match.white.match = undefined;
        match.white.pastMatch = match;
        match.white.socket.emit("end", reason);
    }
    if (match.black) {
        match.black.room = "lobby";
        match.black.match = undefined;
        match.black.pastMatch = match;
        match.black.socket.emit("end", reason);
    }
    match.spectators.forEach(s => {
        s.socket.emit("end", reason);
    });
    matches = matches.filter(m => m != match);
}

function joinMatchOrStart (player) {
    let match = matches.find(m => m.state == "looking" && !m.private);
    if (match)
        joinMatch(match, player);
    else
        Match(player);
}

function playMove (player, move) {
    let match = player.match;
    if (!match) {
        player.socket.emit("deny", "No match found");
        return;
    }
    if (player != match[match.position.turn]) {
        player.socket.emit("deny", "Not your turn");
        return;
    }
    if (!position.isLegalMove(match.position, move)) {
        player.socket.emit("deny", "Not a legal move");
        player.socket.emit("position", match.position);
        return;
    }
    position.positionPlayMove(match.position, move);
    match.moves.push(move);
    Clock.pushClock(match.clock);
    let data = {lastMove: move, moves: match.moves, clock: match.clock};
    match.white.socket.emit("moves", data);
    match.black.socket.emit("moves", data);
    match.spectators.forEach(s => {
        s.socket.emit("moves", data);
    });
    let result = position.positionResult(match.position);
    if (result != "playing")
        endMatch(match, result);
    match[match.position.turn + "DrawOffer"] = false;
}

function offerDraw (player) {
    let match = player.match;
    if (!match) {
        player.socket.emit("deny", "No match found");
        return;
    }
    let color = "white";
    let opponentColor = "black";
    if (player == match.black) {
        color = "black";
        opponentColor = "white";
    } else if (player != match.white) {
        player.socket.emit("deny", "You are not playing this match");
        return;
    }
    if (match[opponentColor + "DrawOffer"]) {
        endMatch(match, "draw agreement");
        return;
    }
    match[color + "DrawOffer"] = true;
    match[opponentColor].socket.emit("draw-offer");
}

function sendData (match) {
    let data = dataForSending(match);
    data.youAre = "white";
    match.white.socket.emit("updateMatch", data);
    data.youAre = "black";
    match.black.socket.emit("updateMatch", data);
    match.spectators.forEach(s => {
        s.socket.emit("updateMatch", data);
    });
}

function dataForSending (match) {
    return {
        matchId: match.id,
        startFen: match.startFen,
        white: match.white.avatar,
        black: match.black.avatar,
        moves: match.moves,
        clock: match.clock
    };
}

function checkClock (player) {
    let match = player.match;
    if (!match) {
        player.socket.emit("deny", "No match found");
        return;
    }
    if (match.state == "finished") {
        player.socket.emit("deny", "This match is allready over");
        return;
    }
    Clock.updateClock(match.clock);
    if (match.clock.white.time <= 0)
        endMatch(match, "timeout white");
    else if (match.clock.black.time <= 0)
        endMatch(match, "timeout black");
}

function updateTimeControl (player, timeControl) {
    if (!timeControl || !player.match || player.match.state != "looking")
        return;
    player.match.timeControl = timeControl;
    player.match.clock = Clock(timeControl.time, timeControl.time, timeControl.increment, timeControl.increment);
}

module.exports = Match;
module.exports.join = joinById;
module.exports.joinMatchOrStart = joinMatchOrStart;
module.exports.playMove = playMove;
module.exports.endMatch = endMatch;
module.exports.sendData = sendData;
module.exports.rematch = rematch;
module.exports.cancleRematch = cancleRematch;
module.exports.offerDraw = offerDraw;
module.exports.checkClock = checkClock;
module.exports.updateTimeControl = updateTimeControl;