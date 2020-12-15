const uuidv1 = require('uuid');

var matches = [];

function Match (players, startingPosition) {
    let id = uuidv1();
    let match = {
        id : id,
        players : players,
        moves : [],
        startingPosition : JSON.parse(startingPosition),
        winner : -2,
        privateMatch : false,
        strikes : []
    };
    match.strikes.push(0);
    matches.push(match);

    return match;
}

function remove(matchID) {
    let i = matches.findIndex((value) => {
        return value.id == matchID;
    });
    matches.splice(i,1);
}

function getMatchByID(matchID) {
    return matches.find((value) => {
        return value.id == matchID;
    });
}

function joinMatch(match, player) {
    if (!match) return;
    match.players.push(player);
    match.strikes.push(0);
    for (let i = 0; i < match.players.length; i++) {
        let j = Math.random() * match.players.length;
        j = Math.floor(j);
        if (j != i) {
            let temp = match.players[i];
            match.players[i] = match.players[j];
            match.players[j] = temp;
        }
    }
}

function joinMatchByID(matchID, player) {
    let match = getMatchByID(matchID);
    joinMatch(match, player);
    return match;
}

function joinAvailable(player) {
    let match = matches.find((value) => {
        return (!value.privateMatch && value.players.length < 2);
    });
    joinMatch(match, player);
    return match;
}

function myPlayerIndex(match ,sessionID) {
    let index = match.players.findIndex((value) => {
        return value.sessionID == sessionID;
    });
    if (index > -1) {
        match.strikes[index]--;
        if (match.strikes[index] < 0) {
            match.strikes[index] = 0;
        }
    }
    return index;
}

function matchRes(match, sessionID) {
    if (!match)
        return "No match";
    let names = [];
    match.players.forEach(element => {
        names.push(element.nickName);
    });
    return {
        matchID : match.id,
        myIndex : myPlayerIndex(match,sessionID),
        names : names,
        moves : match.moves,
        startingPosition : match.startingPosition,
        result : match.winner,
        strikes : match.strikes,
    };
}

var checkInactivityInterval = setInterval(checkInactivity, 5000);

function checkInactivity() {
    matches = matches.filter(element => {
        for (let i = 0; i < element.strikes.length; i++) {
            if (!element.players[i].strikable) return true;
            element.strikes[i]++;
            if (element.strikes[i] > 5) {
                element.winner = (i + 1) % element.strikes.length;
                element.finished = true;
                return element.strikes.length > 1;
            }
        }
        return true;
    });
}

module.exports = Match;
module.exports.remove = remove;
module.exports.getMatchByID = getMatchByID;
module.exports.joinAvailable = joinAvailable;
module.exports.joinMatchByID = joinMatchByID;
module.exports.myPlayerIndex = myPlayerIndex;
module.exports.matchRes = matchRes;

