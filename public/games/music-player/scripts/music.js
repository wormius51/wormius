var context = new AudioContext();
var gainNode = context.createGain()
window.onclick = e => {
    context = new AudioContext();
    context.createGain()
};

var volume = 1;

const soundsDirectory = "sounds/";
const sampleOffsets = {
    "13" : 3
};

function playSample(sample, rate) {
    const source = context.createBufferSource();
    source.buffer = sample;
    source.playbackRate.value = rate;
    gainNode.gain.setValueAtTime(volume, context.currentTime);
    source.connect(context.destination);
    source.start(0);
}

function loadSample(url) {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(buffer => context.decodeAudioData(buffer));
}

function getRateOfNote(note, defaultOctave) {
    let singingText = note.match(/("|”).*("|”)/);
    if (singingText)
        singingText = singingText[0];
    let sampleIndexString = note.match(/^\d*/)[0];
    let noteOnly = "";
    if (sampleIndexString) {
        noteOnly = note.substr(sampleIndexString.length, note.length - sampleIndexString.length);
    } else {
        noteOnly = note;
    }
    if (singingText) {
        noteOnly = note.substr(singingText.length, noteOnly.length - singingText.length);
    }
    noteOnly = noteOnly.toLowerCase();
    let rate = 1;
    let noteIndex = noteOnly.charCodeAt(0) - 'c'.charCodeAt(0);
    if (noteIndex < 0) {
        noteIndex = 7 + noteIndex;
    }
    if (noteOnly.charCodeAt(0) == '?'.charCodeAt(0)) {
        noteIndex = Math.floor(Math.random() * 7);
    }
    let semitone = 1.05946;
    for (let i = 0; i < noteIndex; i++) {
        let factor = semitone;
        if (i != 2)
            factor *= factor;
        rate *= factor;
    }
    let octave = defaultOctave - 4;
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
            octave = parseFloat(subNote) - 4;
        } else if (subNote == "?") {
            octave = Math.floor(Math.random() * 8);
        } 
    }
    rate *= Math.pow(2, octave);
    if (sampleIndexString && sampleOffsets[sampleIndexString]) {
        rate /= Math.pow(semitone, sampleOffsets[sampleIndexString]);
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
            index = -1;
        }
        return index;
    }
    return -1;
}

function getRandomNote() {
    let sampleIndex = Math.floor(Math.random() * 11);
    let randomLetter = String.fromCharCode("a".charCodeAt(0) + Math.floor(Math.random() * 8));
    let addon = "";
    switch (Math.floor(Math.random() * 3)) {
        case 0:
            addon = "b";
            break;
        case 2:
            addon = "#";
            break;
    }
    let octave = Math.floor(Math.random() * 8) + 1;
    return sampleIndex + randomLetter + addon + octave;
}

function playNote(note, defaultInstrument, defaultOctave) {
    if (note == "0")
        return;
    let notes = note.split(',');
    notes.forEach(n => {
        if (n == "?") {
            n = getRandomNote();
        }
        let rate = getRateOfNote(n, defaultOctave);
        let sampleIndex = getSampleIndex(n);
        if (sampleIndex == -1)
            sampleIndex = defaultInstrument;
        if (n.includes('"') || n.includes('”')) {
            textToSing(n, rate, sampleIndex);
        } else {
            
            loadSample(soundsDirectory + sampleIndex + ".wav")
            .then(sample => playSample(sample, rate));
        }
    });
}

function playMusic(musicScript) {
    let musicObject = makeMusicObject(musicScript);
    periodicMusicPlay(musicObject);
}

function periodicMusicPlay(musicObject) {
    let note = musicObject.notes[musicObject.currentNoteIndex];
    musicObject.currentNoteIndex++;
    let timeToNext = 1000 / musicObject.notePerSecond;
    if (note != "0") {
        timeToNext = 0;
        if (!isNaN(note) && isFinite(note)) {
            musicObject.notePerSecond = parseFloat(note);
        } else if (note.match(/i\d+/)) {
            musicObject.defaultInstrument = parseInt(note.substr(1, note.length - 1));
        } else if (note.match(/i\?/)) {
            musicObject.defaultInstrument = Math.floor(Math.random() * 14);
        } else if (note.match(/o\d+/)) {
            musicObject.defaultOctave = parseFloat(note.substr(1, note.length - 1));
        } else if (note.match(/o\?/)) {
            musicObject.defaultOctave = Math.floor(Math.random() * 8);
        } else {
            playNote(note, musicObject.defaultInstrument, musicObject.defaultOctave);
            timeToNext = 1000 / musicObject.notePerSecond;
        }
    }
    
    if (musicObject.currentNoteIndex < musicObject.notes.length) {
        window.setTimeout(() => {periodicMusicPlay(musicObject)}, timeToNext);
    }
}

function makeMusicObject(musicScript) {
    musicScript = musicScript.replace(/("|”)[a-zA-Z0-9 ,.!?$#@%^&*()_+'\\-]+ [a-zA-Z0-9 ,.!?$#@%^&*()'\\-]+("|”)/g, text => {
        let t = text.replaceAll(/\s/g, "_");
        t = t.replaceAll(/,/g, "▀");
        return t;
    });
    let musicObject = {
        notePerSecond : 1,
        currentNoteIndex : 0,
        defaultInstrument : 0,
        defaultOctave : 4,
        notes : musicScript.split(" ")
    };

    return musicObject;
}

function textToSing(note, rate, sampleIndex) {
    let text = note.match(/("|”).*("|”)/)[0];
    if (!text) return;
    let msg = new SpeechSynthesisUtterance();
    msg.text = text.replaceAll("_", " ");
    msg.text = msg.text.replaceAll("▀", ",");
    msg.pitch = rate;
    msg.voice = window.speechSynthesis.getVoices()[sampleIndex];
    window.speechSynthesis.speak(msg);
}