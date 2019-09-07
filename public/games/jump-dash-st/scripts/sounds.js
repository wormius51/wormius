var soundConfig = {
    sfxVolume: 1
};

function plaSound(sound) {
    let audio = new Audio();
    audio.src = "/games/jump-dash-st/sounds/" + sound + ".mp4";
    audio.volume = soundConfig.sfxVolume;
    audio.play();
}

function changeSfxVolume() {
    soundConfig.sfxVolume -= 0.5;
    if (soundConfig.sfxVolume < 0) {
        soundConfig.sfxVolume = 1;
    }
    plaSound("dash");
    saveSoundConfig();
}

function saveSoundConfig() {
    let soundConfigString = JSON.stringify(soundConfig);
    let date = new Date(Date.now() + 99999999999999);
    document.cookie = "soundConfig=" + soundConfigString + "; path=/; expires=" + date.toUTCString();
}

function loadSoundConfig () {
    let varRgx = /soundConfig=({[^;]+})/
    let soundConfigString = varRgx.exec(document.cookie);
    if (!soundConfigString) {
        return;
    }
    soundConfigString = soundConfigString[1];
    soundConfig = JSON.parse(soundConfigString);
}

window.addEventListener('load', loadSoundConfig);