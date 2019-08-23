const textElement = document.getElementById("text");
const charImg = document.getElementById("charImg");

textElement.innerText = "Score: 0";

charImg.style.position = "absolute";


var charX = 200;
var charY = 200;
var charW = 128;
var charH = 128;

charImg.style.top = charY + "px";
charImg.style.left = charX + "px";
charImg.style.width = charW + "px";
charImg.style.height = charH + "px";

var w = false;
var s = false;
var a = false;
var d = false;

var speed = 5;

function moveChar() {
    if (w) {
        charY = charY - speed;
    }
    if (s) {
        charY = charY + speed;
    }
    if (a) {
        charX = charX - speed;
    }
    if (d) {
        charX = charX + speed;
    }
    charImg.style.top = charY + "px";
    charImg.style.left = charX + "px";
    if (charX < goalX + goalW && charX + charW > goalX &&
        charY < goalY + goalH && charY + charH > goalY) {
        changeScore(1);
        moveGoal();
    }
}

function keyDown(event) {
    switch (event.keyCode) {
        case 68:
            d = true;
            break;
        case 65:
            a = true;
            break;
        case 83:
            s = true;
            break;
        case 87:
            w = true;
            break;
    }
}

function keyUp(event) {
    switch (event.keyCode) {
        case 68:
            d = false;
            break;
        case 65:
            a = false;
            break;
        case 83:
            s = false;
            break;
        case 87:
            w = false;
            break;
    }
}

window.onkeydown = keyDown;
window.onkeyup = keyUp;

setInterval(moveChar, 5);