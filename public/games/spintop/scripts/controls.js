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