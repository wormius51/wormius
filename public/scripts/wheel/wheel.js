const canvas = document.getElementById('wheelCanvas');
const context = canvas.getContext('2d');
let cooldownAddition = 0.5;
let wheelRadius = 150;
let wheelLineWidth = 3;
let wheelTextColor = 'black';
let wheelAngleOffset = 0;
let indicatorLength = 60;
let indicatorWidth = 30;
let indicatorOverlap = 20;
let indicatorColor = 'red';
let isSpinning = false;
let spinAnimation = {
    spinTimes: 5,
    startingAngle: 0,
    targetAngle: 0,
    progress: 0,
    startSpeed: 0.0005,
    speed: 0
};
function spin() {
    if (isSpinning)
        return;
    socket.emit("spin");
    let selection = selectRandomPlayer();
    if (selection) {
        isSpinning = true;
        playAnimation(selection);
    }
}

canvas.addEventListener('click', spin);


function selectRandomPlayer() {
    let filteredPlayers = players.filter(selectionFilter);
    let index = Math.floor(Math.random() * filteredPlayers.length);
    let selection = filteredPlayers[index];
    if (selection && players.length > 1)
        updateCooldowns(selection);
    else
        resetCooldowns();
    return selection;
}

function selectionFilter(player) {
    if (player.cooldown >= 1)
        return false;
    return true;
}

function updateCooldowns(selection) {
    if (selection.cooldown)
        selection.cooldown += cooldownAddition;
    else
        selection.cooldown = cooldownAddition;
    players.forEach(player => {
        if (player != selection) {
            if (player.cooldown) {
                player.cooldown -= 1;
                if (player.cooldown < 0)
                    player.cooldown = 0;
            } else {
                player.cooldown = 0;
            }
        }
    });
}

function resetCooldowns() {
    players.forEach(player => {
        player.cooldown = 0;
    });
}

function showSelectedPlayer(selection) {
    selectedPlayer = selection;
    socket.emit("select-player", selection);
    update();
    isSpinning = false;
}
let lastTimeStamp = 0;
function playAnimation(selection) {
    wheelAngleOffset = wheelAngleOffset % (Math.PI * 2);
    spinAnimation.startingAngle = wheelAngleOffset;
    spinAnimation.targetAngle = targetAngleOffset(selection) + Math.PI * 2 * spinAnimation.spinTimes;
    spinAnimation.progress = 0;
    spinAnimation.speed = spinAnimation.startSpeed;
    window.requestAnimationFrame(timeStamp => {spinAnimationStep(timeStamp, selection);});
}


function spinAnimationStep(timeStamp, selection) {
    let deltaTime = timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;
    if (deltaTime > 20)
        deltaTime = 20;
    wheelAngleOffset = spinAnimation.targetAngle * spinAnimation.progress + spinAnimation.startingAngle * (1 - spinAnimation.progress);
    spinAnimation.progress += spinAnimation.speed * deltaTime;
    drawWheel();
    if (spinAnimation.progress > 1) {
        wheelAngleOffset = spinAnimation.targetAngle;
        drawWheel();
        showSelectedPlayer(selection);
    }
    else
        window.requestAnimationFrame(timeStamp => {spinAnimationStep(timeStamp, selection);});
}

function targetAngleOffset(selection) {
    let selectionIndex = players.indexOf(selection);
    let sliceAngle = Math.PI * 2 / players.length;
    return -sliceAngle * (selectionIndex + 0.5);
}

function setAndClearWheel() {
    canvas.height = (wheelRadius + wheelLineWidth) * 2;
    canvas.width = canvas.height + indicatorLength - indicatorOverlap;
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawWheel() {
    let center = wheelRadius + wheelLineWidth;
    setAndClearWheel();
    if (players.length == 0) {
        drawSlice(center, center, wheelRadius,  0, Math.PI * 2, "white");
        context.font = "50px" + " Verdana";
        context.fillStyle = wheelTextColor;
        context.fillText("Invite Players", center - wheelRadius * 0.7, center + 12, wheelRadius * 1.5);
    } else {
        let sliceAngle = Math.PI * 2 / players.length;
        for (let i = 0; i < players.length; i++) {
            let startingAngle = sliceAngle * i + wheelAngleOffset;
            drawSlice(center, center, wheelRadius, startingAngle, sliceAngle, players[i].color);
            drawName(center, center, wheelRadius, startingAngle, sliceAngle, players[i].name);
        }
    }
    drawIndicator();
}

function drawSlice(centerX, centerY, radius, startingAngle, angle, color) {
    context.fillStyle = color;
    context.lineWidth = wheelLineWidth;
    context.beginPath();
    context.arc(centerX, centerY, radius, startingAngle, startingAngle + angle);
    context.moveTo(centerX, centerY);
    context.lineTo(Math.cos(startingAngle) * radius + centerX, Math.sin(startingAngle) * radius + centerY);
    context.lineTo(Math.cos(startingAngle + angle) * radius + centerX, Math.sin(startingAngle + angle) * radius + centerY);
    context.closePath();
    context.fill();
}

function drawName(centerX, centerY, radius, startingAngle, angle, name) {
    let rotation = startingAngle + angle / 2;
    context.translate(centerX, centerY);
    context.rotate(rotation);
    context.fillStyle = wheelTextColor;
    context.font = "30px" + " Verdana";
    context.fillText(name, radius * 0.2, 12, radius * 0.75);
    context.rotate(-rotation);
    context.translate(-centerX, -centerY);
}

function drawIndicator() {
    context.fillStyle = indicatorColor;
    context.beginPath();
    context.moveTo(canvas.width - indicatorLength, canvas.height / 2);
    context.lineTo(canvas.width, (canvas.height + indicatorWidth) / 2);
    context.lineTo(canvas.width, (canvas.height - indicatorWidth) / 2);
    context.closePath();
    context.fill();
}