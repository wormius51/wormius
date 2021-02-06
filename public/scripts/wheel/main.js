const socket = io("/wheel");
const title = document.getElementById('title');
const nameField = document.getElementById('nameField');
const messageField = document.getElementById('messageField');
const colorInput = document.getElementById('colorInput');
const colorDiv = document.getElementById('colorDiv');
const cooldownDiv = document.getElementById('cooldownDiv');
const cooldownInput = document.getElementById('cooldownInput');
const questionText = document.getElementById('question');
const answerText = document.getElementById('answer');
const youSelectedText = document.getElementById('youSelected');

let me = null;
let owner = null;
let selectedPlayer = null;

window.addEventListener('load', () => {
    let wheelOwnerId = document.getElementById('wheelOwnerId').innerHTML;
    socket.emit("add-player", {wheelOwnerId: wheelOwnerId});
});

socket.on("you-joined", start);
socket.on("owner-updated", o => {
    owner.name = o.name;
    owner.message = o.message;
    update();
});
socket.on("you-got-selected", () => {
    youSelectedText.style.visibility = 'visible';
});
socket.on("spin", () => {
    youSelectedText.style.visibility = 'hidden';
});

function start(data) {
    me = data.player;
    owner = data.owner;
    nameField.value = "Name";
    if (me.isOwner) {
        messageField.value = "Question";
        cooldownInput.value = cooldownAddition * 2;
    } else {
        messageField.value = "Answer";
        canvas.style.visibility = 'hidden';
        colorDiv.style.visibility = 'visible';
        colorInput.value = me.color;
        cooldownDiv.style.visibility = 'hidden';
    }
    update();
}

function update() {
    updateTitle();
    updateQuestion();
    updateAnswer();
    if (me.isOwner) {
        cooldownAddition = cooldownInput.value * 0.5;
        drawWheel();
    }
}

function updateTitle() {
    if (me.isOwner)
        title.innerText = "Go to this url to join " + belongsNameVaiation(me.name) + " wheel: " + window.location.href + "/" + me.id;
    else
        title.innerText = "Playing in " + belongsNameVaiation(owner.name) + " wheel";
}

function updateQuestion() {
    if (me.isOwner)
        questionText.innerText = "Question: " + me.message;
    else
        questionText.innerText = "Question: " + owner.message;
}

function updateAnswer() {
    if (me.isOwner) {
        if (selectedPlayer)
            answerText.innerText = belongsNameVaiation(selectedPlayer.name) + " Answer: " + selectedPlayer.message;
    } else {
        answerText.innerText = "Your answer: " + me.message;
    }
}

function belongsNameVaiation(name) {
    return name + (name.length > 0 && name[name.length - 1] == "s"[0] ? '\'' : '') + "s";
}

nameField.addEventListener('input', updateMe);
messageField.addEventListener('input', updateMe);
colorInput.addEventListener('input', updateMe);
cooldownInput.addEventListener('input', update);

function updateMe() {
    me.name = nameField.value;
    me.message = messageField.value;
    me.color = colorInput.value;
    socket.emit("update-player", me);
    update();
}