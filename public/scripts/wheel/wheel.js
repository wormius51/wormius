const canvas = document.getElementById('wheelCanvas');
const context = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
let cooldownAddition = 0.5;
let wheelRadius = 150;
let wheelLineWidth = 3;
let wheelLineColor = 'black';
function spin() {
    socket.emit("spin");
    let selection = selectRandomPlayer();
    if (!selection)
        return;
    playAnimation(selection);
}

spinButton.addEventListener('click', spin);

function selectRandomPlayer() {
    let filteredPlayers = players.filter(selectionFilter);
    let index = Math.floor(Math.random() * filteredPlayers.length);
    let selection = filteredPlayers[index];
    if (selection)
        updateCooldowns(selection);
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

function showSelectedPlayer(selection) {
    selectedPlayer = selection;
    socket.emit("select-player", selection);
    update();
}

function playAnimation(selection) {
    spinButton.disabled = true;
    setTimeout(() => {
        showSelectedPlayer(selection);
        spinButton.disabled = false;
    }, 2000);
}

function drawWheel() {
    if (players.length == 0)
        drawSlice(wheelRadius + wheelLineWidth, wheelRadius + wheelLineWidth, wheelRadius,  0, Math.PI * 2, "white");
    canvas.height = (wheelRadius + wheelLineWidth) * 2;
    canvas.width = canvas.height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    let sliceAngle = Math.PI * 2 / players.length;
    for (let i = 0; i < players.length; i++) {
        drawSlice(wheelRadius + wheelLineWidth, wheelRadius + wheelLineWidth, wheelRadius, sliceAngle * i, sliceAngle, players[i].color);
    }
}

function drawSlice(centerX, centerY, radius, startingAngle, Angle, color) {
    context.fillStyle = color;
    context.strokeStyle = wheelLineColor;
    context.lineWidth = wheelLineWidth;
    context.beginPath();
    context.arc(centerX, centerY, radius, startingAngle, startingAngle + Angle);
    context.moveTo(centerX, centerY);
    context.lineTo(Math.cos(startingAngle) * radius + centerX, Math.sin(startingAngle) * radius + centerY);
    context.lineTo(Math.cos(startingAngle + Angle) * radius + centerX, Math.sin(startingAngle + Angle) * radius + centerY);
    context.closePath();
    context.stroke();
    context.fill();
}