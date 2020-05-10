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
    }
}