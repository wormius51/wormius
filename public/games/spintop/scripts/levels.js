
var reachedLevel = 0;
var currentLevel = 0;

const levels = [
    //spintop
    () => {
        player = SpinTop(Vector2D(0, -200));
        Block(Vector2D(-300, 200), Vector2D(6000, 60));
        bar = ChargeBar(Vector2D(-160, 0));
        Gummy(Vector2D(3000, -50), Vector2D(100, 250));
        Gummy(Vector2D(-800, 350), Vector2D(500, 60));
        Gummy(Vector2D(-800, 210), Vector2D(50, 60));
        Gummy(Vector2D(-350, 210), Vector2D(50, 60));
        Block(Vector2D(-6300, 200), Vector2D(5500, 60));
        Gummy(Vector2D(-3000, -50), Vector2D(100, 250));
    }
];

function loadLevel(index) {
    clearGameObjects();
    eyeBoxesKilled = 0;
    levelScore = 0;
    currentLevel = index;
    levels[currentLevel]();
    camera = Camera();
    if (levelText)
        levelText.text = "Level: " + (currentLevel + 1);
    drawUiElements();
    if (reachedLevel < currentLevel) {
        reachedLevel = currentLevel;
        saveReachedLevel();
    }
    applyUpgrades();
}


function saveReachedLevel() {
    let reachedLevelString = reachedLevel + "";
    let date = new Date(Date.now() + 99999999999999);
    document.cookie = "reachedLevel=" + reachedLevelString + "; path=/; expires=" + date.toUTCString();
}

function loadReachedLevel() {
    let varRgx = /reachedLevel=([^;]+)/
    let reachedLevelString = varRgx.exec(document.cookie);
    if (!reachedLevelString) {
        return;
    }
    reachedLevelString = reachedLevelString[1];
    if (reachedLevelString)
        reachedLevel = +reachedLevelString;
}

window.addEventListener('load', loadReachedLevel);