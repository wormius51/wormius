var players = [];

function Player(sessionID, nickName, colors, eyesStyles) {
    let player = getPlayerByID(sessionID);
    if (player) {
        player.nickName = nickName;
        player.colors = colors;
        player.eyesStyles = eyesStyles;
        return player;
    }
    player = {
        sessionID : sessionID,
        nickName : nickName,
        colors : colors,
        eyesStyles : eyesStyles
    };
    players.push(player);
    return player;
}

function getPlayerByID(ID) {
    return players.find((value) => {
        return value.sessionID == ID;
    });
}

function updatePlayer(player, req) {
    let params = req.body;
    if (params.colors) {
        player.colors = JSON.parse(params.colors);
    }
    if (params.eyesStyles) {
        player.eyesStyles = JSON.parse(params.eyesStyles);
    }
    if (params.nickName) {
        player.nickName = params.nickName;
    }
    
    if (req.body.strikable) {
        player.strikable = true;
    }
    if (req.body.maxHalfSize) {
        player.maxHalfSize = Number.parseInt(req.body.maxHalfSize);
    } else {
        player.maxHalfSize = 7;
    }
    if (req.body.minHalfSize) {
        player.minHalfSize = Number.parseInt(req.body.minHalfSize);
    } else {
        player.minHalfSize = 7;
    }
}

module.exports = Player;
module.exports.getPlayerByID = getPlayerByID;
module.exports.updatePlayer = updatePlayer;