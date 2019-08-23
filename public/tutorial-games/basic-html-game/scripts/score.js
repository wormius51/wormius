var score = 0;

function changeScore(num) {
    score += num;
    textElement.innerText = "Score: " + score;
}

const goalImg = document.createElement('img');
goalImg.src = "images/grail.png";
document.body.appendChild(goalImg);
goalImg.style.position = "absolute";

var goalX = 400;
var goalY = 400;
var goalW = 128;
var goalH = 128;

goalImg.style.top = goalY + "px";
goalImg.style.left = goalX + "px";
goalImg.style.width = goalW + "px";
goalImg.style.height = goalH + "px";

function moveGoal() {
    goalX = Math.random() * 600;
    goalY = Math.random() * 600;

    goalImg.style.top = goalY + "px";
    goalImg.style.left = goalX + "px";
}