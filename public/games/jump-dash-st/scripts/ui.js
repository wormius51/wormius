const uiCanvas = document.getElementById("ui-canvas");
const uiContext = uiCanvas.getContext("2d");

var font = "verda";
var bold = false;
var uiElements = [];

uiContext.font = "30px verda";
uiContext.fillStyle = "white";

var inMenu = false;
var settingKey;

var levelText;
var scoreText;
var optionsPannel;
var setControlsText;

function changeScore(change) {
    score += change;
    scoreText.text = "Score: " + score;
    drawUiElements();
}

function death() {
    loadLevel(currentLevel);
    pause();
}

function pause() {
    paused = true;
}

function unpause() {
    inMenu = false;
    paused = false;
    settingKey = undefined;
    setVisible(optionsPannel, false);
    window.requestAnimationFrame(frame);
}

window.addEventListener('keydown', event => {
    if (event.keyCode == 80) {
        if (paused) {
            unpause();
        } else {
            pause();
        }
    } else if (paused && !inMenu) {
        unpause();
    }
});

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

function drawUiElement(uiElement) {
    if (!uiElement.visible) return;
    if (uiElement.style) {
        if (uiElement.style.borderColor) {
            uiContext.strokeStyle = uiElement.style.borderColor;
            uiContext.strokeRect(uiElement.x * scaleRatio, uiElement.y * scaleRatio, uiElement.width * scaleRatio, uiElement.height * scaleRatio);
        }
        if (uiElement.style.backgroundColor) {
            uiContext.fillStyle = uiElement.style.backgroundColor;
            uiContext.fillRect(uiElement.x * scaleRatio, uiElement.y * scaleRatio, uiElement.width * scaleRatio, uiElement.height * scaleRatio);
        }
    }
    if (uiElement.text) {
        let x = uiElement.x;
        let y = uiElement.y;
        let fontSize = 30;
        if (uiElement.style) {
            if (uiElement.style.color) {
                uiContext.fillStyle = uiElement.style.color;
            } else {
                uiContext.fillStyle = "white";
            }

            if (uiElement.style.paddingX) {
                x += uiElement.style.paddingX;
            }
            if (uiElement.style.paddingY) {
                y += uiElement.style.paddingY;
            }

            if (uiElement.style.fontSize) {
                fontSize = uiElement.style.fontSize;
            }
        }
        y += fontSize;
        uiContext.font = (fontSize * scaleRatio) + "px " + font;
        if (bold) {
            uiContext.font = "bold " + uiContext.font;
        }
        uiContext.fillText(uiElement.text, x * scaleRatio, y * scaleRatio);
    }
}

function drawUiElements() {
    uiElements = uiElements.sort((a, b) => {
        return a.zIndex - b.zIndex;
    });
    uiContext.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
    uiElements.forEach(drawUiElement);
}

function uiClick(event) {
    let x = event.clientX;
    let y = event.clientY;
    let elementsSelected = uiElements.filter(element => {
        if (!element.visible) return false;
        if (x < element.x * scaleRatio || x > element.x * scaleRatio + element.width) return false;
        if (y < element.y * scaleRatio || y > element.y * scaleRatio + element.height) return false;
        return true;
    });
    elementsSelected.forEach(element => {
        if (element.onClick) {
            element.onClick();
        }
    });
}

function setUpUi() {
    uiCanvas.width = gameCanvas.width;
    uiCanvas.height = gameCanvas.height;
    optionsPannel = UiElement(200, 50, 500, 450, "", { backgroundColor: "rgb(88, 78, 153)" });
    let sfxText = UiElement(400, 200, 200, 50, "SFX volume: " + soundConfig.sfxVolume, { color: "white" }, () => {
        changeSfxVolume();
        sfxText.text = "SFX volume: " + soundConfig.sfxVolume;
        drawUiElements();
    });
    optionsPannel.children = [
        UiElement(400, 100, 200, 50, "Controls", { color: "white" }, setControls),
        sfxText,
        UiElement(400, 300, 200, 50, "Resume", { color: "white" }, unpause),

    ];
    setControlsText = UiElement(350, 150, 100, 50, "press key for left", { color: "white" });
    optionsPannel.children.push(setControlsText);
    setVisible(optionsPannel, false);
    UiElement(20, 120, 100, 100, "Options", {},
        () => {
            if (!inMenu) {
                inMenu = true;
                pause();
                setVisible(optionsPannel, true);
                setVisible(setControlsText, false);
            } else {
                unpause();
            }
        });

    levelText = UiElement(20, 40, 100, 50, "Level: 1");
    scoreText = UiElement(20, 80, 100, 50, "Score: 0");
}

window.addEventListener('click', uiClick);

function setControls() {
    setControlsText.text = "press key for ";
    if (!settingKey) {
        setControlsText.text += "left";
        settingKey = "leftKey";
    } else if (settingKey == "leftKey") {
        setControlsText.text += "right";
        settingKey = "rightKey";
    } else if (settingKey == "rightKey") {
        setControlsText.text += "jump";
        settingKey = "upKey";
    } else {
        unpause();
        return
    }
    setVisible(setControlsText, true);
}