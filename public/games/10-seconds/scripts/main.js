import { loadLevel } from "./levels.js";

const title = document.getElementById('title');
const timeSpan = document.getElementById('timeSpan');
const playButton = document.getElementById('playButton');
const levelNumber = +window.location.href.split('?')[1] | 0;

let secondsLeft = 10;

playButton.addEventListener('click', nextLevel);

export const exitingInterval = setInterval(tick, 1000);

loadLevel(levelNumber);

window.addEventListener('keydown', event => {
    if (event.key == 'Tab')
        event.preventDefault();
});

function tick () {
    secondsLeft--;
    title.innerHTML = `Level ${levelNumber} ${secondsLeft} Seconds`;
    timeSpan.innerHTML = secondsLeft;
    if (secondsLeft == 0)
        window.close();
}


export function nextLevel () {
    window.open(`${window.location.origin}/games/10-seconds/?${levelNumber + 1}`);
}