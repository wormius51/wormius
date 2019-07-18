const socket = io("/arrowlings");

const playersOnlineCounter = document.getElementById("players-online");
var players = [];
var me = {};

function getAllPlayers() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            players = JSON.parse(this.response);
            playersOnlineCounter.innerHTML = "players online: " + players.length;
        }
    };
    xhttp.open("GET", "/arrowlings/getAllPlayers", true);
    xhttp.send();
}

socket.emit('add-player');

socket.on('set-player', data => {
    getAllPlayers();
    me = data;
});

socket.on('player-added', data => {
    players.push(data);
    playersOnlineCounter.innerHTML = "players online: " + players.length;
});

socket.on('player-removed', data => {
    console.log("player removed");
    players = players.filter(player => {
        return player.id != data;
    });
    playersOnlineCounter.innerHTML = "players online: " + players.length;
});