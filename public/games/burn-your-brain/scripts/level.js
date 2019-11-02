var isPlayStart = false;
function parseLevel(text) {
    isPlayStart = false;
    clearAllPlatforms();
    let platforms = text.split(",");
    let length = Math.min(platforms.length, 4);
    for (let i = 0; i < length; i++) {
        let rotationIndex = 0;
        let itemsAndRotation = platforms[i].split("#");
        if (itemsAndRotation.length > 1) {
            try {
                rotationIndex = Number.parseInt(itemsAndRotation[1]);
            } catch (e) {
                console.log(e);
            }
        }
        let items = itemsAndRotation[0].split("-");
        for (let j = 0; j < 5; j++) {
            if (!items[j]) items[j] = undefined;
            else {
                let args = items[j].split("");
                items[j] = itemConstructors[args[0]](
                    args[1] == "t", args[2] == "i" ? "in" : "out");
                items[j].index = j;
            }
        }
        Platform(items, rotationIndex);
    }
    renderPlatform();
    rotatePlatform(lastPlatform);
}

function getPlatformString(platform) {
    let s = "";
    for (let i = 0; i < platform.items.length; i++) {
        if (i > 0) s += "-";
        let item = platform.items[i];
        if (item) {
            switch (item.name) {
                case "candle":
                    if (item.gold) {
                        s += "g";
                    } else {
                        s += "c";
                    }
                    break;
                case "flameling":
                    s += "f";
                    break;
                case "iceCube":
                    s += "i";
                    break;
                case "swap":
                    s += "s";
                    break;
            }
            s += item.lit ? "t" : "f";
            s += item.direction[0];
        }
    }
    s += "#" + platform.rotationIndex;
    return s;
}

function getLevelString() {
    let platform = firstPlatform;
    let s = "";
    while (platform) {
        if (s.length > 0) s += ",";
        s += getPlatformString(platform);
        platform = platform.parent;
    }
    return s;
}

function getRandomLevel() {
    let s = "cfi-cfi-cfi-cfi-cfi,";
    let numberOfPlatforms = Math.floor(Math.random() * 3) + 2;
    let items = ["c","f","i","s"];
    for (let i = 0; i < numberOfPlatforms - 1; i++) {
        for (let j = 0; j < 5; j++) {
            let avalibleItems = items;
            if (i == 0) {
                avalibleItems = items.filter(item => {
                    return item != "i";
                });
            }
            let r = Math.floor(Math.random() * (avalibleItems.length + 1));
            if (r < avalibleItems.length) {
                s += avalibleItems[r];
                s += Math.random() > 0.5 ? "t" : "f";
                s += Math.random() > 0.5 ? "i" : "o";
            }
            s += "-";
        }
        s += ",";
    }
    return s;
}

function parseRandomLevel() {
    let level = getRandomLevel();
    parseLevel(level);
    return level;
}

const levels = [
    "cfi-cfi-cfi-cfi-cfi,cfi--gfi-cti-",
    "cfi-cfi-cfi-cfi-cfi,---cfi,gfi---cti",
    "cfi-cfi-cfi-cfi-cfi,-cfi-cfi-cfi-,--cti-fti-gfi",
    "cfi-cfi-cfi-cfi-cfi,cti-cfi-cfi-gfi,ffi-ffi-ffi",
    "cti-cfi-cti-cfi-cfi,cfi-ffi-cfi-ffo-cfi,ffi--gfi--cti",
    "cfi-cfi-cfi-cfi-cfi,fti--gfi-cti-ffi,--ifi-fti-ifi",
    "cfi-cfi-cfi-cfi-cfi,fti-ffi-ffo-cto--,gfi---ito-cfi-,ifo-ffi-ifi-ffi-ito-",
    "cfi-cfi-cfi-cfi-cfi,cfi-ffi-cfo-cfi-ffi-,ifi--cto-ffi-cto-,gfi-ifo-fti-fti-iti-",
    "cfi-cfi-cfi-cfi-cfi,-cti-cfi-gti--,ifi-ffi-cti-ffi-fto-,ffi-iti-ffi-ffi-iti-",
    "cfi-cfi-cfi-cfi-sfo,cti-cfi---fto,--gfi-sfi",
    "sfo-sfo-sfo-sfo-sfo,cfi-cfi,fti-ifi-cfi-ffi-cfi,cti-gfi-ifi-cfi-ifi"
];

const levelTexts = [
    "Rotate the platform to light the candles.",
    "Light the candles in the center.",
    "Flamelings eat candles infront of them.",
    "Fire wakes up flamelings",
    "Flamelings only eat candles.",
    "Ice cubes put out fire.",
    "Ha?",
    "You need to chill brah.",
    "Lost your flame?",
    "Introducing the S.W.A.P! The latest swapping tech.",
    "S.W.A.P activates before everything else."
];

var moveHistory = [];

var currentPosition;

var currentLevel = 0;

function restartLevel() {
    currentPosition = levels[currentLevel];
    parseLevel(currentPosition);
    undoButton.visible = false;
    drawUi();
}

function loadLevel(index) {
    if (index >= levels.length) return;
    currentLevel = index;
    restartLevel();
}

function nextLevel() {
    loadLevel(currentLevel + 1);
}

function undo() {
    if (moveHistory.length > 0) {
        currentPosition = moveHistory.pop();
        parseLevel(currentPosition);
        if (moveHistory.length == 0) {
            undoButton.visible = false;
            drawUi();
        }
    }
}