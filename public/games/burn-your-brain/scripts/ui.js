const uiCanvas = document.getElementById("ui");
const uiContext = uiCanvas.getContext('2d');
uiCanvas.width = window.innerWidth;
uiCanvas.height = window.innerHeight;
uiContext.font = "bold 30px verda";
uiContext.fillStyle = "red";

var buttons = [];
var uiElements = [];

var nextButton;
var undoButton;
var levelsButton;
var levelsPanel;

function UiElement(text, x, y, width, height, paddingX, paddingY, sprite) {
    if (!x) x = 0;
    if (!y) y = 0;
    if (!width) width = 200;
    if (!height) height = 50;
    if (!paddingX) paddingX = 5;
    if (!paddingY) paddingY = 40;
    if (!sprite) sprite = buttonSprite;
    let UiElement = {
        text: text,
        x: x,
        y: y,
        width: width,
        height: height,
        paddingX: paddingX,
        paddingY: paddingY,
        visible: true,
        sprite: sprite
    };
    uiElements.push(UiElement);
    return UiElement;
}

function Button(text, x, y, width, height, onClick, paddingX, paddingY, sprite) {
    if (!sprite) sprite = buttonSprite;
    let button = UiElement(text, x, y, width, height, paddingX, paddingY, sprite);
    button.onClick = onClick;
    buttons.push(button);
    return button;
}

function findButtons(x, y) {
    let buttonsFiltered = buttons.filter(b => {
        let rx = b.width / 2;
        let ry = b.height / 2;
        return x > b.x - rx && x < b.x + rx && y > b.y - ry && y < b.y + ry;
    });
    return buttonsFiltered;
}

function clickUi(x, y) {
    let buttonsFiltered = findButtons(x, y);
    buttonsFiltered.forEach(button => {
        if (button && button.visible) {
            button.onClick();
        }
    });
}

function drawUiElement(UiElement) {
    drawSprite(uiContext, UiElement.sprite, UiElement.x, UiElement.y, 0, UiElement.width, UiElement.height);
    uiContext.fillText(UiElement.text, UiElement.x - UiElement.width / 2 + UiElement.paddingX, UiElement.y - UiElement.height / 2 + UiElement.paddingY);
}

function setUpUi() {
    makeLevelsPanel();
    Button("Restart", 100, 140, 120, 60, () => {
        restartLevel();
        nextButton.visible = false;
        adjustUi();
    }, 10, 40);
    undoButton = Button("Undo", 100, 200, 120, 60, undo, 30, 40);
    undoButton.visible = false;
    nextButton = Button("Next", 100, 200, 120, 60, () => {
        nextButton.visible = false;
        drawUi();
        if (currentLevel < levels.length - 1) {
            nextLevel();
            setLevelsPanelVisible(false);
            drawUi();
        } else {
            uiContext.fillText("That's all for now.", 10, 130);
        }
    }, 30, 40);
    nextButton.visible = false;
    levelsButton = Button("Levels", 100, 260, 120, 60, () => {
        setLevelsPanelVisible(!levelsPanel.visible);
        drawUi();
    }, 20, 40);
    drawUi();
}

window.addEventListener('resize', () => {
    adjustUi();
});

function drawUi() {
    uiCanvas.width = window.innerWidth;
    uiCanvas.height = window.innerHeight;
    uiContext.font = "bold 30px verda";
    uiContext.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
    uiContext.fillStyle = "red";
    uiContext.fillText("Level: " + (currentLevel + 1), 10, 30);
    if (nextButton && nextButton.visible) {
        uiContext.font = "bold 50px verda";
        uiContext.fillText("Victory", 10, 80);
    } else if (levelTexts[currentLevel] && (isMobile ? !isPlayStart : true)) {
        uiContext.fillText(levelTexts[currentLevel], 10, 80);
    }
    uiContext.font = "bold 30px verda";
    uiElements.forEach(element => {
        if (element.visible) {
            drawUiElement(element);
        }
    });
}

function makeLevelsPanel() {
    levelsPanel = UiElement("", window.innerWidth / 2,
        window.innerHeight / 2, window.innerWidth / 2, window.innerHeight * 0.7, 40, 40, buttonSprite);
    levelsPanel.visible = false;
    levelsPanel.buttons = [];
    for (let i = 0; i < levels.length; i++) {
        let button = Button((i + 1),
            0,
            0, 0, 0,
            () => {
                if (!button.disabled) {
                    loadLevel(i);
                    setLevelsPanelVisible(false);
                    nextButton.visible = false;
                    drawUi();
                }
            });
        button.visible = false;
        levelsPanel.buttons.push(button);
    }
    adjustUi();
}

function setLevelsPanelVisible(visible) {
    if (visible == undefined) visible = true;
    levelsPanel.visible = visible;
    levelsPanel.buttons.forEach(button => {
        button.visible = visible;
    });
}

function adjustUi() {
    uiCanvas.width = window.innerWidth;
    uiCanvas.height = window.innerHeight;
    levelsPanel.x = window.innerWidth / 2;
    levelsPanel.width = window.innerWidth / 2;
    levelsPanel.y = window.innerHeight / 2;
    levelsPanel.height = window.innerHeight * 0.7;
    let buttonWidth = levelsPanel.width / 6;
    let k = 0;
    let j = 0;
    for (let i = 0; i < levels.length; i++) {
        let button = levelsPanel.buttons[i];
        button.sprite = platformSprite;
        button.disabled = false;
        button.text = (i + 1);
        if (gameState.reachedLevel > i) {
            if (gameState.goldenCandles.indexOf(i) != -1) {
                button.sprite = pentagramGoldenSprite;
            } else {
                button.sprite = pentagramSprite;
            }
        } else if (gameState.reachedLevel < i) {
            button.disabled = true;
            button.text = "";
            button.sprite = platformDisabledSprite;
        }
        button.x = levelsPanel.x - levelsPanel.width / 2 + levelsPanel.paddingX + buttonWidth / 2 + buttonWidth * k;
        button.y = levelsPanel.y - levelsPanel.height / 2 + levelsPanel.paddingY + buttonWidth / 2 + buttonWidth * j;
        button.width = buttonWidth;
        button.height = buttonWidth;
        button.paddingX = buttonWidth * 0.4 - (i >= 9 ? 6 : 0);
        button.paddingY = buttonWidth * 0.6;
        k++;
        if (k * buttonWidth > levelsPanel.width - levelsPanel.paddingX * 2 - buttonWidth) {
            k = 0;
            j++;
        }
    }
    drawUi();
}