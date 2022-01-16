const turnSound = new Audio("/sounds/chess-ball/turn.wav");

window.addEventListener('my-turn', () => {
    turnSound.play();
});