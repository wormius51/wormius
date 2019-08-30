const uiCanvas = document.getElementById("ui-canvas");
const uiCanvasContext = uiCanvas.getContext('2d');

var font = "verda";
var bold = true;
var uiElements = [];

var mainMenu;
var deathUi;
var victoryUi;
var levelText;

function UiElement(x, y, width, height, text, style, onClick) {
    let uiElement = {
        x: x,
        y: y,
        width: width,
        height: height,
        text: text,
        style: style,
        onClick: onClick,
        visible: true,
        zIndex: 0,
        children: []
    };
    uiElements.push(uiElement);
    return uiElement;
}

function setVisible(uiElement, visible, dontRefresh) {
    uiElement.visible = visible;
    uiElement.children.forEach(child => {
        setVisible(child, visible, true);
    });
    if (!dontRefresh) {
        drawUiElements();
    }
}

function clearUi() {
    uiElements = [];
}

function drawUiElement(uiElement) {
    if (!uiElement.visible) return;
    if (uiElement.style.borderColor) {
        uiCanvasContext.strokeStyle = uiElement.style.borderColor;
        uiCanvasContext.strokeRect(uiElement.x, uiElement.y, uiElement.width, uiElement.height);
    }
    if (uiElement.style.backgroundColor) {
        uiCanvasContext.fillStyle = uiElement.style.backgroundColor;
        uiCanvasContext.fillRect(uiElement.x, uiElement.y, uiElement.width, uiElement.height);
    }
    if (uiElement.text) {
        if (uiElement.style.color) {
            uiCanvasContext.fillStyle = uiElement.style.color;
        } else {
            uiCanvasContext.fillStyle = "black";
        }
        let x = uiElement.x;
        let y = uiElement.y;
        if (uiElement.style.paddingX) {
            x += uiElement.style.paddingX;
        }
        if (uiElement.style.paddingY) {
            y += uiElement.style.paddingY;
        }
        let fontSize = 30;
        if (uiElement.style.fontSize) {
            fontSize = uiElement.style.fontSize;
        }
        y += fontSize;
        uiCanvasContext.font = fontSize + "px " + font;
        if (bold) {
            uiCanvasContext.font = "bold " + uiCanvasContext.font;
        }
        uiCanvasContext.fillText(uiElement.text, x, y);
    }
}

function drawUiElements() {
    uiElements = uiElements.sort((a, b) => {
        return a.zIndex - b.zIndex;
    });
    uiCanvasContext.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
    uiElements.forEach(drawUiElement);
}

function uiClick(event) {
    let x = event.clientX;
    let y = event.clientY;
    let elementsSelected = uiElements.filter(element => {
        if (!element.visible) return false;
        if (x < element.x || x > element.x + element.width) return false;
        if (y < element.y || y > element.y + element.height) return false;
        return true;
    });
    elementsSelected.forEach(element => {
        if (element.onClick) {
            element.onClick();
        }
    });
}

function setUpUi() {
    uiElements = [];
    uiCanvas.width = gameWidth;
    uiCanvas.height = gameHeight;
    mainMenu = UiElement(gameWidth * 0.1, 40, gameWidth * 0.8, 400, "Pile Of Lies", { backgroundColor: "rgb(187, 202, 52)", paddingX: gameWidth * 0.3, paddingY: 40, fontSize: 50 });
    let playButton = UiElement(mainMenu.x + mainMenu.width * 0.45, 200, 100, 50, "Play", {
        backgroundColor: "blue",
        color: "white",
        paddingX: 20
    }, () => {
        setVisible(mainMenu, false);
        loadLevel(currentLevel);
    });
    mainMenu.children.push(playButton);
    playButton.zIndex = 1;

    deathUi = UiElement(gameWidth * 0.1, 40, gameWidth * 0.8, 400, "☠️☠️☠️", { backgroundColor: "rgb(187, 202, 52)", paddingX: gameWidth * 0.3, paddingY: 40, fontSize: 50, color: "red" });
    let replayButton = UiElement(mainMenu.x + mainMenu.width * 0.45, 200, 120, 50, "Replay", {
        backgroundColor: "blue",
        color: "white",
        paddingX: 20
    }, () => {
        setVisible(deathUi, false);
        loadLevel(currentLevel);
    });
    deathUi.children.push(replayButton);
    replayButton.zIndex = 1;
    setVisible(deathUi, false);

    victoryUi = UiElement(gameWidth * 0.1, 40, gameWidth * 0.8, 400, "Nice one!", { backgroundColor: "rgb(187, 202, 52)", paddingX: gameWidth * 0.25, paddingY: 40, fontSize: 50, color: "green" });
    let nextButton = UiElement(mainMenu.x + mainMenu.width * 0.45, 200, 120, 50, "Next", {
        backgroundColor: "blue",
        color: "white",
        paddingX: 20
    }, () => {
        setVisible(deathUi, false);
        loadNextLevel();
    });
    victoryUi.children.push(nextButton);
    nextButton.zIndex = 1;
    setVisible(victoryUi, false);

    levelText = UiElement(0, 0, 100, 100, "Level: 1", { fontSize: 50 });
    levelText.visible = false;
    drawUiElements();
}

function hideAllUi() {
    uiElements.forEach(element => {
        element.visible = false;
    });
    uiCanvasContext.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
}

function victory() {
    setVisible(victoryUi, true);
    if (currentLevel >= levels.length - 1) {
        victoryUi.text = "You beat the game";
        victoryUi.children[0].visible = false;
    }
    drawUiElements();
}

window.addEventListener('click', uiClick);