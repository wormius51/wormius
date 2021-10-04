var soundConfig = {
    sfxVolume: 0.5
};

var soundDampening = 0.02;

function plaSound(sound, position) {
    let audio = new Audio();
    audio.src = "sounds/" + sound;
    if (sound.indexOf(".") == -1)
        audio.src += ".mp4";
    audio.volume = soundConfig.sfxVolume;
    if (position) {
        let d = distance(position, player.position);
        let v = soundConfig.sfxVolume;
        if (d != 0) 
            v = audio.volume / (d * soundDampening);
        if (v > soundConfig.sfxVolume)
            v = soundConfig.sfxVolume;
        audio.volume = v;
    }
    audio.play();
}

function changeSfxVolume() {
    soundConfig.sfxVolume -= 0.5;
    if (soundConfig.sfxVolume < 0) {
        soundConfig.sfxVolume = 1;
    }
    plaSound("dash.wav");
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