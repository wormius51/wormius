
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

socket.on('unlock', data => {
    unlock(data);
});