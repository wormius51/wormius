const musicTextField = document.getElementById("musicTextField");
const playButton = document.getElementById("playButton");
playButton.addEventListener('click', () => {playMusic(musicTextField.value)});