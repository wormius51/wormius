const screenCanvas = document.getElementById("screenCanvas");
const context = screenCanvas.getContext('2d');

const columns = 32;
const rows = 32;
var pixelSize = 10;

screenCanvas.width = columns * pixelSize;
screenCanvas.height = rows * pixelSize;

var ruleExecutionInterval = 100;
var maxDeltaTime = 20;
var previousTimeStamp = 0;
var timeSinceRuleExecution = 0;
var isGameOn = false;

var currentPixelsMatrix = [];

var flowerInterval = 5000;
var honetInterval = 6000;
var currentHornetInterval = 0;
var timeSinceFlower = 0;
var timeSinceHornet = 0;
var flowerSpawnPadding = 10;

window.onload = () => {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, screenCanvas.width, screenCanvas.height);
    loadHighScore();
}

window.addEventListener('keydown', event => {
    if (!isGameOn && event.keyCode == 82) {
        setup();
    }
});

document.getElementById("coinSlot").addEventListener('click', startGame);
document.getElementById("insertCoinText").addEventListener('click', startGame);

function startGame() {
    if (!isGameOn) {
        setup();
        frame();
    }
    document.getElementById("insertCoinText").style.visibility = "hidden";
}

function setup() {
    isGameOn = true;
    currentPixelsMatrix = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            row.push("#000000");
        }
        currentPixelsMatrix.push(row);
    }
    timeSinceFlower = 0;
    timeSinceHornet = 0;
    currentHornetInterval = honetInterval;
    energy = 0;
    spawnBee(16,16);
    changeScore(-score);
}

function frame(timeStamp) {
    if (!previousTimeStamp) {
        previousTimeStamp = timeStamp;
    }
    let deltaTime = timeStamp - previousTimeStamp;
    if (deltaTime > maxDeltaTime) {
        deltaTime = maxDeltaTime;
    }
    if (timeStamp - timeSinceFlower >= flowerInterval) {
        timeSinceFlower = timeStamp;
        spawnFlower(Math.floor(Math.random() * (columns - flowerSpawnPadding * 2)) + flowerSpawnPadding, Math.floor(Math.random() * (rows - flowerSpawnPadding * 2)) + flowerSpawnPadding)
    }

    if (timeStamp - timeSinceHornet >= currentHornetInterval /(10 / (Math.exp(-score) + 3))) {
        timeSinceHornet = timeStamp;
        spawnHornet(Math.floor(Math.random() * (columns - hornetAvoidRange * 2)) + hornetAvoidRange, Math.floor(Math.random() * (rows - hornetAvoidRange * 2)) + hornetAvoidRange, Math.floor(Math.random() * 8))
    }

    if (timeStamp - timeSinceRuleExecution >= ruleExecutionInterval) {
        timeSinceRuleExecution = timeStamp;
        currentPixelsMatrix = rule();
        drawScreen();
    }
    if (isGameOn)
        window.requestAnimationFrame(frame);
}

function rule() {
    let newPixelsMatrix = [];
    let isAlvie = false;
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            let ruleResult = pixelRule(i, j);
            row.push(ruleResult);
            if (ruleResult.match("#" + beeColor)) {
                isAlvie = true;
            }
        }
        newPixelsMatrix.push(row);
    }
    if (!isAlvie) {
        scoreText.innerHTML = " <span style = 'color:red'>No More Bees Left</span>";
        isGameOn = false;
        document.getElementById("insertCoinText").style.visibility = "visible";
    }
    return newPixelsMatrix;
}

function pixelRule(i, j) {
    let newPixel = currentPixelsMatrix[i][j];
    newPixel = moveBee(i, j, newPixel);
    newPixel = moveHornet(i, j, newPixel);
    
    // Leave the pixel the same
    return newPixel;
}

function drawScreen() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            drawPixel(j, i);
        }
    }
}

function drawPixel(x, y) {
    context.fillStyle = currentPixelsMatrix[y][x];
    context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}