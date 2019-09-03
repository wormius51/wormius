const uiCanvas = document.getElementById("ui-canvas");
const uiContext = uiCanvas.getContext("2d");

uiContext.font = "bold 30px verda";

function drawScore() {
    uiContext.fillText("Score: " + score, 20, 100);
}

function drawLevelNumber() {
    uiContext.fillText("Level: " + (currentLevel + 1), 20, 40);
}

function redrawUI() {
    uiContext.clearRect(0,0,uiCanvas.width,uiCanvas.height);
    drawScore();
    drawLevelNumber();
}

function changeScore(change) {
    score += change;
    redrawUI();
}

function death() {
    loadLevel(currentLevel);
    pause();
}

function pause() {
    paused = true;
}

function unpause() {
    paused = false;
    window.requestAnimationFrame(frame);
}

window.addEventListener('keydown', event => {
    if (paused) {
        unpause();
    } else {
        if (event.key == "p") {
            pause();
        }
    }
});