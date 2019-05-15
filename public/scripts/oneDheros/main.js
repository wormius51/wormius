const socket = io("/oneDheros");
const gameView = document.getElementById("game-view");
const context = gameView.getContext("2d");
const namesCanvas = document.getElementById("names");
const speachCanvas = document.getElementById("speach");
const namesContext = namesCanvas.getContext("2d");
const speachContext = speachCanvas.getContext("2d");
var nameHieght = namesCanvas.height / 2;

namesContext.font = "bold 20px Arial";


var camera = {
    x : 50,
    speed : 0.1
};

var myId = -1;

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
    var grd = context.createLinearGradient(0,0,200,0);
    grd.addColorStop(0,gameObject.color);
    context.fillStyle = grd;
    let x = gameObject.id != undefined ? gameObject.x - camera.x + 50 : gameObject.x;
    context.fillRect((x * 10) - (gameObject.width * 5),0,gameObject.width * 10,1000);
    if (gameObject.type == "player") {
        drawName(gameObject);
    }
}

function drawAll() {
    context.clearRect(0, 0, gameView.width, gameView.height);
    namesContext.clearRect(0, 0, namesCanvas.width, namesCanvas.height);
    //speachContext.clearRect(0, 0, speachCanvas.width, speachCanvas.height);
    background();
    gameObjects.forEach(gameObject => {
        draw(gameObject);
    });
}

function drawName(gameObject) {
    namesContext.fillStyle = gameObject.color;
    let x = gameObject.id != undefined ? gameObject.x - camera.x + 50 : gameObject.x;
    namesContext.fillText(gameObject.name, (x * 10) - (gameObject.width * 5), nameHieght);
}

socket.on('object-added', data => {
    gameObjects.push(data);
});

socket.on('object-updated', data => {
    updateObject(data);
});

socket.on('object-removed', data => {
    removeObjectById(data);
});

socket.on('set-id', data => {
    myId = data;
});

function changeName() {
    let nameField = document.getElementById("name");
    socket.emit('change-name', nameField.value);
}

function gameLoop() {
    if (myId != -1) {
        let me = getObjectById(myId);
        camera.x += (me.x - camera.x ) * camera.speed;
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
		
		case 68:
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
		
		case 68:
		d = false;
		break;
    }
    emitKeys();
}