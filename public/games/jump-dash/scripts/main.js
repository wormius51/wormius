const gameCanvas = document.getElementById("game-canvas");
const gameContext = gameCanvas.getContext("2d");

gameCanvas.width = 900;
gameCanvas.height = 600;

var paused = false;

var score = 0;
var scoreMultiplier = 1;

var lastFrameTimeStamp = 0;
/**
 * The upper limit of the time difference between frames.
 * If the frame rate is slower, the game is going to slow down rather
 * then let object teleport wierdly.
 */
const maxDeltaTime = 20;

var player;
var camera;

/**
 * This function runs every frame.
 * @param {Number} timeStamp The amount of miliseconds that has passed since the start of the game.
 */
function frame(timeStamp) {
    if (!lastFrameTimeStamp) lastFrameTimeStamp = timeStamp;
    let deltaTime = timeStamp - lastFrameTimeStamp;
    if (deltaTime > maxDeltaTime) {
        deltaTime = maxDeltaTime;
    }
    lastFrameTimeStamp = timeStamp;
    updateGameObjects(deltaTime);
    drawGameScreen();
    if (!paused) {
        window.requestAnimationFrame(frame);
    }
}

window.addEventListener('load', () => {
    setUpUi();
    window.requestAnimationFrame(frame);
    loadLevel(0);
});

function drawGameObject(gameObject) {
    gameContext.fillStyle = gameObject.color;
    let positionOnScreen = Vector2D(gameObject.position.x - camera.position.x + gameCanvas.width / 2,
        gameObject.position.y - camera.position.y + gameCanvas.height / 2);
    gameContext.fillRect(positionOnScreen.x, 
        positionOnScreen.y,
        gameObject.scale.x, gameObject.scale.y);
    gameObject.onDraw(positionOnScreen);
}

function drawGameScreen() {
    gameContext.clearRect(0,0,gameCanvas.width,gameCanvas.height);
    gameObjects.sort((a,b) => {
        return a.zIndex - b.zIndex;
    }).forEach(drawGameObject);
}