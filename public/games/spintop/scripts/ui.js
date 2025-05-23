const uiCanvas = document.getElementById("ui-canvas");
const uiContext = uiCanvas.getContext("2d");

var font = "verda";
var bold = false;
var uiElements = [];

uiContext.font = "30px verda";
uiContext.fillStyle = "white";

var inMenu = false;
var settingKey;

var deathText;
var levelText;
var scoreText;
var optionsPannel;
var setControlsText;

var skinsText;
var skinButtons = [];
var mobileButtons = [];

var unlockTextBox;
var postRunPannel;

var goldText;

if (isMobile) {
    screen.orientation.lock('landscape');
}

function changeScore(change) {
    score += change;
    scoreText.text = "Score: " + score;
    drawUiElements();
    levelScore += change;
}

function changeGold (change) {
    gold += change;
    goldText.text = "Gold: " + gold;
    drawUiElements();
}

function death() {
    checkUnlocks();
    changeScore(-levelScore);
    loadLevel(currentLevel);
    pause();
    deaths++;
    deathText.text = "Deaths: " + deaths;
    scoreMultiplier = 1;
}

function endRun () {
    changeGold(score);
    setVisible(postRunPannel, true);
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

function restart() {
    changeScore(-score);
    loadLevel(0);
    setVisible(postRunPannel, false);
    unpause();
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

window.addEventListener('touchstart', event => {
    if (paused && !inMenu) {
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
    if (!uiElement)
        return;
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
        if (uiElement.style.image) {
            uiContext.drawImage(uiElement.style.image, uiElement.x * scaleRatio, uiElement.y * scaleRatio, uiElement.width * scaleRatio, uiElement.height * scaleRatio);
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
        let lines = uiElement.text.split("\n");
        for (let i = 0; i < lines.length; i++) {
            if (lines[i])
                uiContext.fillText(lines[i], x * scaleRatio, y * scaleRatio + fontSize * scaleRatio * i);
        }
        //uiContext.fillText(uiElement.text, x * scaleRatio, y * scaleRatio);
    }
}

function drawUiElements() {
    uiCanvas.width = gameCanvas.width;
    uiCanvas.height = gameCanvas.height;
    uiElements = uiElements.sort((a, b) => {
        return a.zIndex - b.zIndex;
    });
    uiContext.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
    uiElements.forEach(drawUiElement);
}

function checkOnUi(element, x, y) {
    if (!element.visible) return false;
    if (x < element.x * scaleRatio || x > (element.x + element.width) * scaleRatio) return false;
    if (y < element.y * scaleRatio || y > (element.y + element.height) * scaleRatio) return false;
    return true;
}

function uiClick(event) {
    let x = event.clientX;
    let y = event.clientY;
    let elementsSelected = uiElements.filter(element => {
        return checkOnUi(element, x, y);
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
    scoreText = UiElement(20, 20, 100, 50, "Score: 0", "white");
    postRunPannel = UiElement(300, 100, 550, 400, "", { backgroundColor: "rgb(88, 78, 153)" });
    postRunPannel.visible = false;
    goldText = UiElement(525, 110, 100, 50, "Gold: 0", "white");
    postRunPannel.children = [
        goldText,
        UiElement(525, 400, 100, 40, "Spin", { color: "white", backgroundColor: "green", paddingX: 20, borderColor: "black"}, restart)
    ];
    for (let i = 0; i < upgrades.length; i++) {
        let button = UiElement(310 + 135 * i, 200, 125, 70, upgrades[i].name + "\n" + upgrades[i].cost,
            { color: "white", backgroundColor: "green", paddingX: 5, borderColor: "black"},
            () => {
                buyUpgrade(button.i);
                button.text = upgrades[button.i].name + "\n" + upgrades[button.i].cost;
                drawUiElements();
            });
        button.i = i;
        postRunPannel.children.push(button);
    }
    postRunPannel.children.forEach(e => {
        e.visible = false;
    });
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

function makeSkinButtons() {
    for (let i = 0; i < unlocks.skins.length; i++) {
        let skin = unlocks.skins[i];
        let skinButton = UiElement(250 + 70 * i, 400, 60, 60);
        skinButtons.push(skinButton);
        if (skin.unlocked) {
            unlockSkinButton(i, skin.name);
        } else {
            skinButton.style = { backgroundColor: "grey", };
            skinButton.onClick = () => {
                skinsText.text = skin.description;
                drawUiElements();
            }
        }
        optionsPannel.children.push(skinButton);

    }
}

function makeMobileButtons() {
    mobileButtons.left = UiElement(0, 400, 200, 200, "", { image: images.left });
    mobileButtons.right = UiElement(200, 400, 200, 200, "", { image: images.right });
    mobileButtons.up = UiElement(gameCanvas.width / scaleRatio - 200, 400, 200, 200, "", { image: images.up });
}

function unlockSkinButton(i, skin) {
    let skinButton = skinButtons[i];
    skinButton.text = "";
    skinButton.style = { backgroundColor: "blue", image: images[skin] };
    skinButton.onClick = () => {
        unlocks.currentSkin = skin;
        saveUnlocks();
        if (player) {
            player.image = images[skin];
        }
        unpause();
    };
}

function showUnlock(skin) {
    unlockTextBox.text = skin.description;
    unlockTextBox.children[0].style.image = images[skin.name];
    setVisible(unlockTextBox, true);
    moveunlockBox(0);
}

function moveunlockBox(offset) {
    if (offset < unlockTextBox.width) {
        unlockTextBox.x = gameCanvas.width / scaleRatio - offset
        unlockTextBox.children[0].x = gameCanvas.width / scaleRatio + 10 - offset;
        drawUiElements();
        offset += 20 / (1 + offset / 23);
        setTimeout(() => {
            moveunlockBox(offset);
        }, 5);
    } else {
        setTimeout(() => {
            unlockTextBox.x = uiCanvas.width / scaleRatio;
            unlockTextBox.children[0].x = uiCanvas.width / scaleRatio + 10;
            setVisible(unlockTextBox, false);
            drawUiElements();
        }, 2000);
    }
}