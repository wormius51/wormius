const animator = Animator(document.getElementById("game-view"), 60);
animator.canvas.width = window.innerWidth;
animator.canvas.height = window.innerHeight;

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

window.addEventListener('load', () => {
    loadGameState();
    setUpUi();
    parseLevel(levels[currentLevel]);
    animator.frame();
});

window.addEventListener('resize', () => {
    animator.canvas.width = window.innerWidth;
    animator.canvas.height = window.innerHeight;
    if (currentPosition) {
        parseLevel(currentPosition);
    } else {
        parseLevel(levels[currentLevel]);
    }
});

function checkWin() {
    if (nextButton.visible) return;
    let isWin = true;
    for (let i = 0; i < 5; i++) {
        let item = firstPlatform.items[i];
        if (!item || item.name != "candle" || !item.lit) {
            isWin = false;
            break;
        }
    }
    if (isWin) {
        win();
    }
}

function win() {
    nextButton.visible = true;
    undoButton.visible = false;
    drawUi();
    moveHistory = [];
    if (currentLevel >= gameState.reachedLevel) {
        gameState.reachedLevel = currentLevel + 1;
    }
    if (gameState.goldenCandles.indexOf(currentLevel) == -1) {
        if (checkGolden(lastPlatform)) {
            gameState.goldenCandles.push(currentLevel);
        }
    }
    adjustUi();
    saveGameState();
}

function checkGolden(platform) {
    let goldenCandle = platform.items.find(item => {
        return item && item.lit && item.gold;
    });
    if (goldenCandle) {
        return true;
    } else if (platform.child) {
        return checkGolden(platform.child);
    } else {
        return false;
    }
}