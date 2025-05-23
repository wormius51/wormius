const socket = io("/oneDheros");
const gameView = document.getElementById("game-view");
const context = gameView.getContext("2d");
const namesCanvas = document.getElementById("names");
const speachCanvas = document.getElementById("speach");
const namesContext = namesCanvas.getContext("2d");
const speachContext = speachCanvas.getContext("2d");
var nameHeight = namesCanvas.height / 2;
var messageHeight = 14;
var maxLineLenght = 30;
var lineBreakHeight = 15;
namesContext.font = "bold 20px Arial";
speachContext.font = "bold 15px Arial";

const nameField = document.getElementById("name");
const rejoinButton = document.getElementById("rejoin");
const myPositionText = document.getElementById("my-position");
const upgradePointsText = document.getElementById("upgrade-points");

var camera = {
    x : 50,
    speed : 0.1
};

var muted = false;
const muteToggleButton = document.getElementById("mute");

var myId = -1;
var me;

var gameObjects = [];

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        gameObjects = JSON.parse(this.response);
        socket.emit('add-player');
    }
};
xhttp.open("GET", "/oneDheros/getAllObjects", true);
xhttp.send();

function background() {
    draw({
        x : 50,
        width : 100,
        color : "rgb(17, 21, 29)",
    });
}

function draw(gameObject) {
    if (gameObject.invisible) return;
    var grd = context.createLinearGradient(0,0,200,0);
    grd.addColorStop(0,gameObject.color);
    context.fillStyle = grd;
    let x = gameObject.id != undefined ? gameObject.x - camera.x + 50 : gameObject.x;
    context.fillRect((x * 10) - (gameObject.width * 5),0,gameObject.width * 10,1000);
    if (gameObject.type == "player" || gameObject.type == "npc") {
        drawName(gameObject);
    }
    if (gameObject.message) {
        drawMessage(gameObject);
    }
}

function drawAll() {
    if (!me) me = getObjectById(myId);
    context.clearRect(0, 0, gameView.width, gameView.height);
    namesContext.clearRect(0, 0, namesCanvas.width, namesCanvas.height);
    speachContext.clearRect(0, 0, speachCanvas.width, speachCanvas.height);
    background();
    gameObjects.forEach(gameObject => {
        if (gameObject && (!me || Math.abs(gameObject.x - me.x) < 100)) {
            draw(gameObject);
        }
    });
}

function drawName(gameObject) {
    namesContext.fillStyle = gameObject.color;
    let x = gameObject.id != undefined ? gameObject.x - camera.x + 50 : gameObject.x;
    namesContext.fillText(gameObject.name, (x * 10) - (gameObject.width * 5), nameHeight);
    if (gameObject.type == "player") namesContext.fillText("Level " + Math.floor(gameObject.level), (x * 10) - (gameObject.width * 5), nameHeight + 20);
}

function drawMessage(gameObject) {
    speachContext.fillStyle = gameObject.color;
    let x = gameObject.id != undefined ? gameObject.x - camera.x + 50 : gameObject.x;
    x = (x * 10) - (gameObject.width * 5);
    drawMessageText(gameObject.message, x, messageHeight);
}

function drawMessageText(text, x, y) {
    if (!text.length) return;
    if (text.length <= maxLineLenght) {
        speachContext.fillText(text, x, y);
    } else {
        drawMessageText(text.substring(0,maxLineLenght), x, y);
        drawMessageText(text.substring(maxLineLenght), x, y + lineBreakHeight);
    }
}

socket.on('object-added', data => {
    gameObjects.push(data);
    if (me) {
        if (!muted && data.sound && (!me || Math.abs(data.x - me.x) < 1000)) {
            let audio = new Audio("sounds/" + data.sound);
            audio.play();
            audio.volume = 1 / (1 + Math.abs(me.x - data.x) * 0.5);
        }
    }
});

socket.on('object-updated', data => {
    updateObject(data);
});

socket.on('objects-updated', data => {
    data.forEach(element => {
        updateObject(element);
    });
});

socket.on('object-removed', data => {
    removeObjectById(data);
});

socket.on('objects-removed', data => {
    data.forEach(element => {
        removeObjectById(element.id);
    });
});

socket.on('set-id', data => {
    myId = data;
    let gameObject = getObjectById(myId);
    myPositionText.innerText = "My Position : " + Math.floor(gameObject.x);
    me = gameObject;
});

socket.on('said', data => {
    let gameObject = getObjectById(data.id);
    if (gameObject) {
        gameObject.message = data.message;
    }
});

function toggleMute() {
    muted = !muted;
    muteToggleButton.innerText = muted ? "🔇" : "🔊";
}

function changeName() {
    socket.emit('change-name', nameField.value);
}

function sendMessage() {
    let messageField = document.getElementById("message");
    socket.emit('say', messageField.value);
    messageField.value = "";
}

function useAbility(abilityName) {
    socket.emit('use-ability', abilityName);
}

function rejoin() {
    socket.emit('add-player', {name : nameField.value});
    rejoinButton.style.visibility = "hidden";
    let hiddenButtons = document.getElementsByClassName("start-hidden");
    for (let i = 0; i < hiddenButtons.length; i++) {
        hiddenButtons[i].style.visibility = "hidden";
        hiddenButtons[i].style.width = "0px";
    }
    let visibleButtons = document.getElementsByClassName("start-visible");
    for (let i = 0; i < visibleButtons.length; i++) {
        visibleButtons[i].style.visibility = "visible";
        visibleButtons[i].style.width = "inherit";
    };
}

function gameLoop() {
    if (getObjectById(myId)) {
        rejoinButton.style.visibility = "hidden";
        camera.x += (me.x - camera.x ) * camera.speed;
    } else {
        rejoinButton.style.visibility = "visible";
    }
    drawAll();
}

var loop = setInterval(gameLoop, 5);

var w = false;
var s = false;
var a = false;
var d = false;

function emitKeys() {
    socket.emit('keys',{
        leftPressed : a,
        rightPressed : d
    });
}

function keydown() {
	var evt = window.event;
	var chr = evt.keyCode;
	switch (chr) {
		case 87:
		w = true;
		break;
		
		case 83:
		s = true;
		break;
		
		case 65:
		a = true;
        break;
        
        case 37:
        a = true;
        break;
		
		case 68:
		d = true;
        break;

        case 39:
        d = true;
        break;
        
        case 13:
        sendMessage();
        break;
	}
    emitKeys();
}

function keyup() {
	var evt = window.event;
	var chr = evt.keyCode;
	switch (chr) {
		case 87:
		w = false;
		break;
		
		case 83:
		s = false;
		break;
		
		case 65:
		a = false;
        break;
        
        case 37:
        a = false;
        break;
		
		case 68:
		d = false;
        break;
        
        case 39:
        d = false;
        break;
    }
    emitKeys();
}