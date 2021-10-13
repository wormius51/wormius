const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/**
 * contains the information about the state of the keys.
 */
var controls = {
    upKey: { key: "SPACE", keyCode: 32, pressed: false },
    downKey: { key: "S", keyCode: 83, pressed: false },
    leftKey: { key: "A", keyCode: 65, pressed: false },
    rightKey: { key: "D", keyCode: 68, pressed: false }
};

const editorControls = {
    delete: { key: "DELETE", keyCode: 46, pressed: false },
    move: { key: "M", keyCode: 77, pressed: false },
    scale: { key: "S", keyCode: 83, pressed: false },
    ctrl: { key: "CONTROL", keyCode: 17, pressed: false },
    save: { key: "S", keyCode: 83, pressed: false },
    load: { ket: "L", keyCode: 76, pressed: false },
    block: { key: "1", keyCode: 49, pressed: false },
    gummy: { key: "2", keyCode: 50, pressed: false },
    goal: { key: "3", keyCode: 51, pressed: false},
    coin: { key: "4", keyCode: 52, pressed: false },
    enemy: { key: "5", keyCode: 53, pressed: false},
    flyingEnemy: { key: "6", keyCode: 54, pressed: false},
    launcher: { key: "6", keyCode: 55, pressed: false},
    upDash: { key: "7", keyCode: 56, pressed: false},
    sideDash: { key: "8", keyCode: 57, pressed: false},
    text: { key: "0", keyCode: 48, pressed: false }
};

if (isMobile) {
    controls.upKey.key = "UP";
    controls.leftKey.key = "LEFT";
    controls.rightKey.key = "RIGHT";
}

function saveControls() {
    if (isMobile) return;
    let controlsString = JSON.stringify(controls);
    let date = new Date(Date.now() + 99999999999999);
    document.cookie = "controls=" + controlsString + "; path=/; expires=" + date.toUTCString();
}

function loadControls() {
    if (isMobile) return;
    let varRgx = /controls=({[^;]+})/
    let controlsString = varRgx.exec(document.cookie);
    if (!controlsString) {
        return;
    }
    controlsString = controlsString[1];
    controls = JSON.parse(controlsString);
}

window.addEventListener('load', loadControls);

function releaseAllKeys() {
    for (const [key, value] of Object.entries(controls)) {
        value.pressed = false;
    }
    for (const [key, value] of Object.entries(editorControls)) {
        value.pressed = false;
    }
}

window.addEventListener('blur', releaseAllKeys);

function keyChange(event, changeTo) {
    if (!settingKey) {
        for (const [key, value] of Object.entries(controls)) {
            if (value.keyCode == event.keyCode)
                value.pressed = changeTo;
        }
        for (const [key, value] of Object.entries(editorControls)) {
            if (value.keyCode == event.keyCode)
                value.pressed = changeTo;
        }
        if (editorControls.ctrl.pressed) {
            event.preventDefault();
            if (editorControls.save.pressed)
                saveLevel();
            else if (editorControls.load.pressed)
                uploadLevel();
        }
    } else {
        if (changeTo) {
            controls[settingKey].key = event.key.toUpperCase();
            if (controls[settingKey].key.match(/\s+/)) controls[settingKey].key = "SPACE";
            controls[settingKey].keyCode = event.keyCode;
            setControls();
            saveControls();
        }
    }
}

window.addEventListener('keydown', event => {
    keyChange(event, true);
});

window.addEventListener('keyup', event => {
    keyChange(event, false);
});

function tapChange(event, changeTo) {
    for (let i = 0; i < event.changedTouches.length; i++) {
        let touch = event.changedTouches[i];
        if (checkOnUi(mobileButtons.left, touch.pageX, touch.pageY)) {
            keyChange({ keyCode: controls.leftKey.keyCode, key: "LEFT" }, changeTo);
            if (changeTo)
                keyChange({ keyCode: controls.rightKey.keyCode, key: "RIGHT" }, false);
        } else if (checkOnUi(mobileButtons.right, touch.pageX, touch.pageY)) {
            keyChange({ keyCode: controls.rightKey.keyCode, key: "RIGHT" }, changeTo);
            if (changeTo)
                keyChange({ keyCode: controls.leftKey.keyCode, key: "LEFT" }, false);
        } else {
            if (checkOnUi(mobileButtons.up, touch.pageX, touch.pageY)) {
                keyChange({ keyCode: controls.upKey.keyCode, key: "UP" }, changeTo);
            } else {
                keyChange({ keyCode: controls.upKey.keyCode, key: "UP" }, false);
            }
        }
    }
}

window.addEventListener('touchstart', event => {
    tapChange(event, true);
});

window.addEventListener('touchmove', event => {
    tapChange(event, true);
});

window.addEventListener('touchend', event => {
    tapChange(event, false);
});