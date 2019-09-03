/**
 * contains the information about the state of the keys.
 */
const controls = {
    upKey: { key: "Space", keyCode: 32, pressed: false },
    downKey: { key: "S", keyCode: 83, pressed: false },
    leftKey: { key: "A", keyCode: 65, pressed: false },
    rightKey: { key: "D", keyCode: 68, pressed: false }
};

function releaseAllKeys() {
    controls.upKey.pressed = false;
    controls.downKey.pressed = false;
    controls.leftKey.pressed = false;
    controls.rightKey.pressed = false;
}

window.addEventListener('blur', releaseAllKeys);

function keyChange(event, changeTo) {
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
}

window.addEventListener('keydown', event => {
    keyChange(event, true);
});

window.addEventListener('keyup', event => {
    keyChange(event, false);
});