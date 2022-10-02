import { exitingInterval, nextLevel } from "./main.js";

const playButton = document.getElementById('playButton');


const levels = [];


export function loadLevel (levelNumber) {
    if (levels[levelNumber])
        levels[levelNumber]();
}

levels[0] = () => {
    clearInterval(exitingInterval);
};

levels[1] = () => {
    let y = 0;
    const speed = 0.3;
    setInterval(() => {
        y += speed;
        playButton.style.transform = `translateY(${y}px)`;
    }, 5);
};


levels[2] = () => {
    let y = 0;
    const speed = -0.05;
    setInterval(() => {
        y += speed;
        document.body.style.transform = `rotateZ(${y}deg)`;
    }, 5);
};

levels[3] = () => {
    let y = 0;
    const speed = 0.8;
    setInterval(() => {
        y += speed;
        document.body.style.transform = `rotateY(${y}deg)`;
    }, 5);
};


levels[4] = () => {
    playButton.style.display = 'none';
    document.getElementById('letterButtonsDiv').style.display = 'block';
    const pButton = document.getElementById('pButton');
    const lButton = document.getElementById('lButton');
    const aButton = document.getElementById('aButton');
    const yButton = document.getElementById('yButton');

    const mainH1 = document.getElementById('mainH1');

    let index = 0;
    const letters = ['p','l','a','y'];

    function inputLetter (letter) {
        if (index == 0)
            mainH1.innerHTML = letter;
        else
            mainH1.innerHTML += letter;
        if (letter == letters[index]) {
            index++;
        } else {
            index = 0;
        }
        
        if (index >= letters.length) {
            nextLevel();
            index = 0;
        }
    }

    pButton.addEventListener('click', () => inputLetter('p'));
    lButton.addEventListener('click', () => inputLetter('l'));
    aButton.addEventListener('click', () => inputLetter('a'));
    yButton.addEventListener('click', () => inputLetter('y'));
};


levels[5] = () => {
    const closeButton = document.getElementById('closeButton');
    closeButton.style.display = 'block';
    closeButton.addEventListener('click', () => window.close());
};


levels[6] = () => {
    levels[5]();
    document.getElementById('buttonsDiv').style.transform = 'rotateZ(180deg)';
};

levels[7] = () => {
    levels[2]();
    levels[4]();
};

levels[8] = () => {
    levels[3]();
    levels[4]();
};

levels[9] = () => {
    const mainH1 = document.getElementById('mainH1');
    mainH1.className = "win";
    mainH1.innerHTML = "You did it! Thanks for playing!";
    playButton.style.display = 'none';
    clearInterval(exitingInterval);
};