const gameCanvas = document.getElementById("game-canvas");
const gameCanvasContext = gameCanvas.getContext('2d');

var lastFrameTime = 0;
var antiblur = true;
var isFocus = true;

var gameHeight = 547;
var gameWidth = 931;

function setup() {
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
    setUpUi();
}

window.addEventListener('load',() =>  {
    setup();
    window.requestAnimationFrame(frame);
});

window.addEventListener('resize', setup);

window.onblur = () => {
    if (!antiblur) return;
    isFocus = false;
    lastFrameTime = 0;
    controls.upKey.pressed = controls.downKey.pressed = controls.leftKey.pressed = controls.rightKey.pressed = false;
}

window.onfocus = () => {
    isFocus = true;
}

function frame(timeStamp) {
    if (!lastFrameTime) lastFrameTime = timeStamp;
    let deltaTime = timeStamp - lastFrameTime;
    updateGameObjects(deltaTime);
    drawGameView();
    lastFrameTime = timeStamp;
    window.requestAnimationFrame(frame);
}

function drawGameView() {
    gameCanvasContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameObjects.forEach(drawGameObject);
}