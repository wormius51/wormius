const gameCanvas = document.getElementById("game-canvas");
const gameContext = gameCanvas.getContext("2d");

const version = "0.0.0.4";

let originalWidth = 900;
let originalHeight = 600;
let scaleRatio = window.innerHeight / originalHeight;

gameCanvas.width = originalWidth;
gameCanvas.height = originalHeight;

var paused = false;

var deaths = 0;
var score = 0;
var levelScore = 0;
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
    checkUnlocks();
}

function adjustScale() {
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
    scaleRatio = window.innerHeight / originalHeight;
    if (unlockTextBox) {
        unlockTextBox.x = uiCanvas.width / scaleRatio;
        unlockTextBox.children[0].x = uiCanvas.width / scaleRatio + 10;
    }
    if (mobileButtons.up) {
        mobileButtons.up.x = gameCanvas.width / scaleRatio - 200;
    }
    drawUiElements();
}

window.addEventListener('load', () => {
    adjustScale();
    setUpUi();
    window.requestAnimationFrame(frame);
    loadLevel(0);
});

window.addEventListener('resize', adjustScale);

function drawGameObject(gameObject) {

    gameContext.fillStyle = gameObject.color;
    let positionOnScreen = Vector2D(gameObject.position.x - camera.position.x,
        gameObject.position.y - camera.position.y);
    let offset = Vector2D(50, 50);
    mulVectorNum(offset, -0.5);
    addVectors(positionOnScreen, offset);
    mulVectorNum(positionOnScreen, scaleRatio);
    offset = Vector2D(gameCanvas.width, gameCanvas.height);
    mulVectorNum(offset, 0.5);
    addVectors(positionOnScreen, offset);
    let scale = copyVector2D(gameObject.scale);
    mulVectorNum(scale, scaleRatio);
    if (gameObject.color != "clear") {
        gameContext.fillRect(positionOnScreen.x,
            positionOnScreen.y,
            scale.x, scale.y);
    }
    if (gameObject.image) {
        gameContext.drawImage(gameObject.image, positionOnScreen.x, positionOnScreen.y, scale.x, scale.y);
    }
    gameObject.onDraw(positionOnScreen);
}

function drawGameScreen() {
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameObjects.sort((a, b) => {
        return a.zIndex - b.zIndex;
    }).forEach(drawGameObject);
}