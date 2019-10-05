const gameCanvas = document.getElementById("gameCanvas");
const gameContext = gameCanvas.getContext("2d");

const socket = io('/canvas-land');

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

function setup () {
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
    mouseX = gameCanvas.width / 2;
    mouseY = gameCanvas.height / 2;
    window.requestAnimationFrame(frame);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var lines = JSON.parse(this.response);
            for (let i = 0; i < lines.length; i++) {
                drawLine(lines[i]);
            }
        }
    };
    xhttp.open("GET", "/canvas-land/getLines", true);
    xhttp.send();
}

window.addEventListener('load', setup);

window.addEventListener('resize', setup);

function frame(timeStamp) {
    if (!previousTimeStamp) previousTimeStamp = timeStamp;
    let deltaTime = timeStamp - previousTimeStamp;
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
    socket.emit("add-line", {
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        width: width,
        color: color
    });
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
    mouseX = event.clientX;
    mouseY = event.clientY;
});

window.addEventListener('mousedown', () => {
    isMouseDown = true;
});

window.addEventListener('mouseup', () => {
    isMouseDown = false;
});

window.addEventListener('touchmove', event => {
    mouseX = event.touches[0].pageX;
    mouseY = event.touches[0].pageY;
});

window.addEventListener('touchstart', event => {
    mouseX = event.touches[0].pageX;
    mouseY = event.touches[0].pageY;
    previousMouseX = mouseX;
    previousMouseY = mouseY;
    isMouseDown = true;
    
});

window.addEventListener('touchend', () => {
    isMouseDown = false;
});