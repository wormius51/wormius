
var gameState = {
    reachedLevel: 0,
    goldenCandles: []
};

function saveGameState () {
    let gameStateString = JSON.stringify(gameState);
    let date = new Date(Date.now() + 99999999999999);
    document.cookie = "gameState=" + gameStateString + "; path=/; expires=" + date.toUTCString();
    testState = "gameState=" + gameStateString + "; path=/; expires=" + date.toUTCString();
}

function loadGameState () {
    let varRgx = /gameState=({[^;]+})/
    let gameStateString = varRgx.exec(document.cookie);
    if (!gameStateString) {
        return;
    }
    gameStateString = gameStateString[1];
    gameState = JSON.parse(gameStateString);
}