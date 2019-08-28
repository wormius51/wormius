
const controls = {
    upKey: { key: "w", keyCode: 87, pressed: false },
    downKey: { key: "s", keyCode: 83, pressed: false },
    leftKey: { key: "a", keyCode: 65, pressed: false },
    rightKey: { key: "d", keyCode: 68, pressed: false }
};

function keyChange(event, changeTo) {
    let key;
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
    if (key) {
        key.pressed = changeTo;
    }
}

window.addEventListener('keydown', event => {
    keyChange(event, true);
});

window.addEventListener('keyup', event => {
    keyChange(event, false);
});
