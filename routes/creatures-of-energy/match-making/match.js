const uuidv1 = require('uuid/v1');

var matches = [];

function Match(players,mode) {
    let id = uuidv1();
    if (!mode) {
        mode = 'OneVsOne';
    }
    let match = {
        mode : mode,
        id : id,
        players : players,
        moves : [],
        winner : -2,
        maxHalfSize : 25,
        minHalfSize : 6,
        halfSize : 7,
        privateMatch : false
    };
    adjustSizeRange(match);
    match.strikes = [];
    match.strikes.push(0);
    matches.push(match);
    return match;
}

function adjustSizeRange(match) {
    match.players.forEach ((value) => {
        if (value.maxHalfSize < match.maxHalfSize) {
            match.maxHalfSize = value.maxHalfSize;
        }
        if (value.minHalfSize > match.minHalfSize) {
            match.minHalfSize = value.minHalfSize;
        }
    });
    if (match.minHalfSize > match.maxHalfSize) {
        let temp = match.minHalfSize;
        match.minHalfSize = match.maxHalfSize;
        match.maxHalfSize = temp;
    }
}

function pickBardSize(match) {
    match.halfSize = Math.floor(Math.random() * (match.maxHalfSize - match.minHalfSize + 1) + match.minHalfSize);
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
    if (match) {
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
        adjustSizeRange(match);
        pickBardSize(match);
    }
}

function joinMatchByID(matchID, player) {
    let match = getMatchByID(matchID);
    joinMatch(match, player);
    return match;
}

function joinAvailable(player) {
    let match = matches.find((value) => {
        return (!value.privateMatch
            && value.players.length < 2
            && player.maxHalfSize >= value.minHalfSize
            && player.minHalfSize <= value.maxHalfSize
            );
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
    let names = [];
    let colors = [];
    let eyesStyles = [];
    let i = 0;
    match.players.forEach(element => {
        names.push(element.nickName);
        if (element.colors) {
            colors.push(element.colors[i]);
        }
        if (element.eyesStyles) {
            eyesStyles.push(element.eyesStyles[i]);
        }
        i++;
    });
    return {
        mode : match.mode,
        matchID : match.id,
        myIndex : myPlayerIndex(match,sessionID),
        names : names,
        colors : colors,
        eyesStyles : eyesStyles,
        moves : match.moves,
        result : match.winner,
        strikes : match.strikes,
        halfSize : match.halfSize
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