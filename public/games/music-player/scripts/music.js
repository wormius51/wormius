var context = new AudioContext();
window.onclick = e => {
    context = new AudioContext();
};

const soundsDirectory = "./sounds/";

function playSample(sample, rate) {
    const source = context.createBufferSource();
    source.buffer = sample;
    source.playbackRate.value = rate;
    source.connect(context.destination);
    source.start(0);
}

function loadSample(url) {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(buffer => context.decodeAudioData(buffer));
}

function getRateOfNote(note) {
    let sampleIndexString = note.match(/^\d*/)[0];
    let noteOnly = "";
    if (sampleIndexString) {
        noteOnly = note.substr(sampleIndexString.length, note.length - sampleIndexString.length);
    } else {
        noteOnly = note;
    }
    noteOnly = noteOnly.toLowerCase();
    let rate = 1;
    let noteIndex = noteOnly.charCodeAt(0) - 'c'.charCodeAt(0);
    if (noteIndex < 0) {
        noteIndex = 7 + noteIndex;
    }
    let semitone = 1.05946;
    for (let i = 0; i < noteIndex; i++) {
        let factor = semitone;
        if (i != 2)
            factor *= factor;
        rate *= factor;
    }

    if (noteOnly.length > 1) {
        let subNote = noteOnly.substr(1, noteOnly.length) + "";
        if (subNote.includes("#")) {
            rate *= semitone;
        } else if (subNote.includes("b")) {
            rate /= semitone;
        } 
        if (noteOnly.length > 2) {
            if (subNote.endsWith("#") || subNote.endsWith("b")) {
                subNote = noteOnly.substr(1, noteOnly.length - 2);
            } else {
                subNote = noteOnly.substr(2, noteOnly.length - 2);
            }
        }
        if (!isNaN(subNote) && isFinite(subNote)) {  
            let octave = parseFloat(subNote) - 4;
            rate *= Math.pow(2, octave);
        } 
    }
    return rate;
}

function getSampleIndex(note) {
    if (note.charCodeAt(0) == "?".charCodeAt(0)) {
        return Math.floor(Math.random() * 8);
    }
    let sampleIndex = note.match(/^\d*/)[0];
    if (!isNaN(sampleIndex) && isFinite(sampleIndex)) {
        let index = parseInt(sampleIndex);
        if (isNaN(index)) {
            index = 0;
        }
        return index;
    }
    return 0;
}

function playNote(note) {
    if (note == "0")
        return;
    let notes = note.split(',');
    notes.forEach(n => {
        let rate = getRateOfNote(n);
        let sampleIndex = getSampleIndex(n);
        loadSample(soundsDirectory + sampleIndex + ".wav")
        .then(sample => playSample(sample, rate));
    });
    
}

function playMusic(musicScript) {
    let musicObject = makeMusicObject(musicScript);
    periodicMusicPlay(musicObject);
}

function periodicMusicPlay(musicObject) {
    let note = musicObject.notes[musicObject.currentNoteIndex];
    if (note != "0") {
        if (!isNaN(note) && isFinite(note)) {
            musicObject.notePerSecond = parseFloat(note);
        } else {
            playNote(note);
        }
    }
    musicObject.currentNoteIndex++;
    if (musicObject.currentNoteIndex < musicObject.notes.length) {
        window.setTimeout(() => {periodicMusicPlay(musicObject)}, 1000 / musicObject.notePerSecond);
    }
}

function makeMusicObject(musicScript) {
    let musicObject = {
        notePerSecond : 1,
        currentNoteIndex : 0,
        notes : musicScript.split(" ")
    };

    return musicObject;
}
