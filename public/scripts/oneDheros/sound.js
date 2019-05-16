
function Sound(src) {
    let sound = document.createElement("audio");
    sound.src = "/sounds/" + src;
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    document.body.appendChild(sound);
    return sound;
}