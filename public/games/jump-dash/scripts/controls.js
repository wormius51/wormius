/**
 * contains the information about the state of the keys.
 */
var controls = {
    upKey: { key: "Space", keyCode: 32, pressed: false },
    downKey: { key: "S", keyCode: 83, pressed: false },
    leftKey: { key: "A", keyCode: 65, pressed: false },
    rightKey: { key: "D", keyCode: 68, pressed: false }
};

function saveControls () {
    let controlsString = JSON.stringify(controls);
    let date = new Date(Date.now() + 99999999999999);
    document.cookie = "controls=" + controlsString + "; path=/; expires=" + date.toUTCString();
}

function loadControls () {
    let varRgx = /controls=({.+})/
    let controlsString = varRgx.exec(document.cookie);
    if (!controlsString) {
        return;
    }
    controlsString = controlsString[1];
    controls = JSON.parse(controlsString);
}

window.addEventListener('load', loadControls);

function releaseAllKeys() {
    controls.upKey.pressed = false;
    controls.downKey.pressed = false;
    controls.leftKey.pressed = false;
    controls.rightKey.pressed = false;
}

window.addEventListener('blur', releaseAllKeys);

function keyChange(event, changeTo) {
    if (!settingKey) {
        switch (event.keyCode) {
            case controls.upKey.keyCode:
                controls.upKey.pressed = changeTo
                break;
            case controls.downKey.keyCode:
                controls.downKey.pressed = changeTo
                break;
            case controls.leftKey.keyCode:
                controls.leftKey.pressed = changeTo
                break;
            case controls.rightKey.keyCode:
                controls.rightKey.pressed = changeTo
                break;
        }
    } else {
        if (changeTo) {
            controls[settingKey].key = event.key.toUpperCase();
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