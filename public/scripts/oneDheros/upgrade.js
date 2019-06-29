
function upgrade(type) {
    socket.emit("upgrade", type);
}

function unlock(skill) {
    let buttons = document.getElementsByName(skill);
    buttons[0].style.visibility = "hidden";
    buttons[0].style.width = "0px";
    buttons[1].style.visibility = "visible";
    buttons[1].style.width = "inherit";
}

function showSkill(skill) {
    let buttons = document.getElementsByName(skill);
    buttons[0].style.visibility = "visible";
    buttons[0].style.width = "inherit";
}

socket.on('unlock', data => {
    unlock(data);
});

socket.on('show-skill', data => {
    data.forEach(element => {
        showSkill(element);
    });
});