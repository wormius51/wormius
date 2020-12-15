var players = [];

function Player(sessionID, nickName) {
    let player = getPlayerByID(sessionID);
    if (player) {
        player.nickName = nickName;
        return player;
    }
    player = {
        sessionID : sessionID,
        nickName : nickName,
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
    if (params.nickName) {
        player.nickName = params.nickName;
    }
}

module.exports = Player;
module.exports.getPlayerByID = getPlayerByID;
module.exports.updatePlayer = updatePlayer;