const shortid = require('shortid');
const position = require('./position');

var matches = [];

function Match (player) {
    let match = {};
    if (Math.random() > 0.5)
        match.white = player;
    else 
        match.black = player;
    match.moves = [];
    match.id = shortid.generate();
    match.position = position.getStartingPosition();
    match.spectators = [];
    match.state = "looking";
    matches.push(match);
    player.room = match.id;
    player.match = match;
    player.socket.emit("matchId", match.id);
    return match;
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
    if (match.white == player || match.black == player) {
        player.socket.emit("looking", matchId);
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
        avatars.push(s);
    })
    match.white.socket.emit("spectators", avatars);
    match.black.socket.emit("spectators", avatars);
    match.spectators.forEach(spectator => {
        spectator.socket.emit("spectators", avatars);
    });
}

function startMatch (match) {
    match.state = "playing";
    let data = {
        matchId: match.id,
        white: match.white.avatar,
        black: match.black.avatar,
        moves: []
    };
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
        match.white.socket.emit("end", reason);
    }
    if (match.black) {
        match.black.room = "lobby";
        match.black.match = undefined;
        match.black.socket.emit("end", reason);
    }
    match.spectators.forEach(s => {
        s.socket.emit("end", reason);
    });
    matches = matches.filter(m => m != match);
}

function joinMatchOrStart (player) {
    let match = matches.find(m => m.state == "looking");
    if (match)
        joinMatch(match, player);
    else
        Match(player);
}

function playMove (player, move) {
    let match = getMatchById(player.room);
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
        return;
    }
    position.positionPlayMove(match.position, move);
    match.moves.push(move);
    let data = {lastMove: move, moves: match.moves};
    match.white.socket.emit("moves", data);
    match.black.socket.emit("moves", data);
    match.spectators.forEach(s => {
        s.socket.emit("moves", data);
    });
    let result = position.positionResult(match.position);
    if (result != "playing")
        endMatch(match, result);
}

module.exports = Match;
module.exports.join = joinById;
module.exports.joinMatchOrStart = joinMatchOrStart;
module.exports.playMove = playMove;
module.exports.endMatch = endMatch;