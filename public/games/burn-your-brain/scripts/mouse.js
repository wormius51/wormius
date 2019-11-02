var startingAngle = 0;

function convertEvent(event) {
    if (event.changedTouches) {
        let touch = event.changedTouches[0];
        event.clientX = touch.pageX;
        event.clientY = touch.pageY;
    }
}

function mousedown(event) {
    isPlayStart = true;
    drawUi();
    convertEvent(event);
    if (nextButton.visible) return;
    if (!selectedPlatform) {
        selectPlatform(event.clientX, event.clientY);
        startingAngle = mouseAngle(event);
    }  
}

function moveMouse(event) {
    convertEvent(event);
    if (selectedPlatform) {
        let dr = mouseAngle(event) - startingAngle;
        rotatePlatform(selectedPlatform, dr);
    }
}

function click(event) {
    convertEvent(event);
    clickUi(event.clientX, event.clientY);
}

function mouseup(event) {
    drawUi();
    convertEvent(event);
    if (selectedPlatform) {
        let dr = mouseAngle(event) - startingAngle;
        fixPlatformRotation(selectedPlatform, dr);
        selectedPlatform = undefined;
        rotatePlatform(lastPlatform,0);
    }
}

window.addEventListener('mouseup', mouseup);
window.addEventListener('touchend',mouseup);

window.addEventListener('load', () => {
    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('click', click);
    window.addEventListener('touchmove', moveMouse);
});

window.addEventListener('mousedown', mousedown);

window.addEventListener('touchstart', mousedown);

function mouseAngle(event, platform) {
    if (!platform) {
        platform = selectedPlatform;
    }
    if (!platform) return;
    let dx = event.clientX - platform.animation.x;
    let dy = event.clientY - platform.animation.y;
    let angle = Math.atan(dy / dx);
    if (dx < 0) {
        angle += Math.PI;
    }
    return angle;
}