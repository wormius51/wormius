const gameCanvas = document.getElementById("gameCanvas");
const gameContext = gameCanvas.getContext("2d");
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const socket = io('/canvas-land');

var myX = -5000;
var myY = -5000;
var moveSpeed = 5;

var upKey = false;
var downKey = false;
var leftKey = false;
var rightKey = false;

var previousTimeStamp = 0;
var isMouseDown = false;
var mouseX = 0;
var mouseY = 0;
var brushSize = 5;
function getRandom() {
    return Math.random() * 255;
}
var brushColor = "rgb(" + getRandom() + "," + getRandom() + "," + getRandom() + ")";

var previousMouseX = 0;
var previousMouseY = 0;

function setup() {
    mouseX = gameCanvas.width / 2;
    mouseY = gameCanvas.height / 2;
    window.requestAnimationFrame(frame);
    if (!isMobile) {
        drawLinesFromServer(0);
        gameCanvas.width = 10000;
        gameCanvas.height = 10000;
    } else {
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;
        myX = 0;
        myY = 0;
    }
}


var maxNumber = 100;
function drawLinesFromServer(startIndex) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var lines = JSON.parse(this.response);
            let i = 0
            for (i = 0; i < lines.length; i++) {
                drawLine(lines[i]);
            }
            if (i >= maxNumber) {
                drawLinesFromServer(startIndex + i);
            }
        }
    };
    xhttp.open("GET", "/canvas-land/getLimitedLines?startIndex=" + startIndex + "&maxNumber=" + maxNumber, true);
    xhttp.send();
}

window.addEventListener('load', setup);

window.addEventListener('resize', setup);

function frame(timeStamp) {
    if (!previousTimeStamp) previousTimeStamp = timeStamp;
    let deltaTime = timeStamp - previousTimeStamp;
    if (upKey) {
        myY += moveSpeed * deltaTime;
    }
    if (downKey) {
        myY -= moveSpeed * deltaTime;
    }
    if (leftKey) {
        myX += moveSpeed * deltaTime;
    }
    if (rightKey) {
        myX -= moveSpeed * deltaTime;
    }
    gameCanvas.style.left = myX + "px";
    gameCanvas.style.top = myY + "px";
    if (isMouseDown) {
        makeLine(previousMouseX, previousMouseY, mouseX, mouseY, brushSize, brushColor);
    } else {
        previousMouseX = mouseX;
        previousMouseY = mouseY;
    }
    previousTimeStamp = timeStamp;
    window.requestAnimationFrame(frame);
}

function makePoint(x, y, size, color) {
    gameContext.fillStyle = color;
    gameContext.fillRect(x - size / 2, y - size / 2, size, size);
}

function makeLine(x0, y0, x1, y1, width, color) {
    if (!x0) x0 = x1;
    if (!y0) y0 = y1;
    previousMouseX = mouseX;
    previousMouseY = mouseY;
    let line = {
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        width: width,
        color: color
    };
    drawLine(line);
    socket.emit("add-line", line);
}

function drawLine(line) {
    gameContext.beginPath();
    gameContext.lineWidth = line.width;
    gameContext.strokeStyle = line.color;
    gameContext.moveTo(line.x0, line.y0);
    gameContext.lineTo(line.x1, line.y1);
    gameContext.stroke();
}

socket.on("line-added", drawLine);

window.addEventListener('mousemove', event => {
    mouseX = event.clientX - myX;
    mouseY = event.clientY - myY;
});

window.addEventListener('mousedown', () => {
    isMouseDown = true;
});

window.addEventListener('mouseup', () => {
    isMouseDown = false;
});

window.addEventListener('touchmove', event => {
    mouseX = event.touches[0].pageX - myX;
    mouseY = event.touches[0].pageY - myY;
});

window.addEventListener('touchstart', event => {
    mouseX = event.touches[0].pageX - myX;
    mouseY = event.touches[0].pageY - myY;
    previousMouseX = mouseX;
    previousMouseY = mouseY;
    isMouseDown = true;

});

window.addEventListener('touchend', () => {
    isMouseDown = false;
});

function changeKeyState(event, changeTo) {
    switch (event.keyCode) {
        case 87:
            upKey = changeTo;
            break;
        case 83:
            downKey = changeTo;
            break;
        case 65:
            leftKey = changeTo;
            break;
        case 68:
            rightKey = changeTo;
            break;
        case 187:
        case 107:
            if (brushSize < 20) {
                brushSize++;
            }
            break;
        case 189:
        case 109:
            if (brushSize > 1) {
                brushSize--;
            }
            break;
    }
}

window.addEventListener('keydown', event => {
    changeKeyState(event, true);
});

window.addEventListener('keyup', event => {
    changeKeyState(event, false);
});