var unlocks = {
    skins: [Skin("none"),
    Skin("gentelCube", "Get 3000 points in one run.",
        () => {
            return score >= 3000;
        }),
    Skin("ninja", "Dash 3 times in one jump.",
        () => {
            if (!player) return false;
            return player.dashes >= 3;
        }),
    Skin("dummy", "Die on the first level.",
        () => {
            if (currentLevel == 0) {
                if (!player || player.destroy) {
                    return true;
                }
            }
            return false;
        }),
    Skin("nine", "Get over 9000 points in one run",
        () => {
            return score > 9000;
        }),
    Skin("pumpkin", "Get all 5 pumpkins",
        () => {
            return pumpkins.filter(p => p).length >= pumpkins.length;
        })]
};

const pumpkins = [false, false, false, false, false];

function Skin(name, description, condition) {
    if (!condition) condition = () => true;
    let skin = {
        name: name,
        description: description,
        condition: condition,
        unlocked: false
    };
    return skin;
}

function saveUnlocks() {
    let unlocksString = JSON.stringify(unlocks);
    let date = new Date(Date.now() + 99999999999999);
    document.cookie = "unlocks=" + unlocksString + "; path=/; expires=" + date.toUTCString();
}

function loadUnlocks() {
    let varRgx = /unlocks=({[^;]+})/
    let unlocksString = varRgx.exec(document.cookie);
    if (!unlocksString) {
        return;
    }
    unlocksString = unlocksString[1];
    let loadedUnlocks = JSON.parse(unlocksString);
    for (let i = 0; i < loadedUnlocks.skins.length; i++) {
        unlocks.skins[i].unlocked = loadedUnlocks.skins[i].unlocked;
    }
    unlocks.currentSkin = loadedUnlocks.currentSkin;
}

window.addEventListener('load', loadUnlocks);

function checkUnlocks() {
    for (let i = 0; i < unlocks.skins.length; i++) {
        let skin = unlocks.skins[i];
        if (!skin.unlocked && skin.condition()) {
            skin.unlocked = true;
            unlockSkinButton(i, skin.name);
            saveUnlocks();
            if (skin.description) {
                showUnlock(skin);
            }
        }
    }
}