const scoreText = document.getElementById("scoreText");
const highScoreText = document.getElementById("highScoreText");

var score = 0;
var highscore = 0;

function changeScore(change) {
    score += change;
    scoreText.innerHTML = "Score: " + score;
    if (highscore < score) {
        highscore = score;
        highScoreText.innerHTML = "HighScore: " + highscore;
        let date = new Date(Date.now() + 99999999999999);
        document.cookie = "highScore=" + highscore + "; path=/; expires=" + date.toUTCString();
    }
}

function loadHighScore() {
    let varRgx = /highScore=({[^;]+})/;
    let cookieHighScore = varRgx.exec(document.cookie);
    console.log(cookieHighScore);
    if (!cookieHighScore) {
        return;
    }
    highscore = cookieHighScore * 1;
    highScoreText.innerHTML = "HighScore: " + highscore;
}