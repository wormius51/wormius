var players = [];

socket.on("player-joined", addPlayer);
socket.on("player-updated", updatePlayer);
socket.on("player-left", removePlayer);


function addPlayer(player) {
    players.push(player);
    update();
}

function updatePlayer(player) {
    let currentPlayer = players.find(p => {
        return p.id == player.id;
    });
    if (currentPlayer) {
        currentPlayer.name = player.name;
        currentPlayer.message = player.message;
        currentPlayer.color = player.color;
    }
    update();
}

function removePlayer(player) {
    players = players.filter(p => {
        return p.id != player.id;
    });
    update();
}