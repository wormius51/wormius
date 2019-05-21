
function upgrade(type) {
    socket.emit("upgrade", type);
}

function unlock(skill) {
    let buttons = document.getElementsByName(skill);
    buttons[0].style.visibility = "hidden";
    buttons[1].style.visibility = "visible";
}

socket.on('unlock', data => {
    unlock(data);
});