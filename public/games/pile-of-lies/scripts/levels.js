
var currentLevel = 0;

const levels = [
    () => {
        Border(40);
        Movable(700, 60, 60, 60, "goal", "yellow");
        Player(400, 400, 40, 40);
    },
    () => {
        Border(40);
        Movable(700, 60, 40, 40, "goal", "yellow");
        Movable(600, 40, 60, 400, "enemy", "red");
        Movable(700, 400, 100, 60, "enemy", "red");
        Player(400, 400, 40, 40);
    },
    () => {
        let border = Border(40);
        border.forEach(block => {
            block.color = "red";
        });
        Movable(700, 60, 40, 40, "goal", "yellow");
        Movable(600, 40, 60, 400, "enemy", "purple");
        Movable(700, 400, 100, 60, "enemy", "purple");
        Player(400, 400, 40, 40);
    },
    () => {
        let border = Border(40);
        border.forEach(block => {
            block.color = "blue";
        });
        Movable(700, 60, 40, 40, "enemy", "red");
        Movable(600, 40, 60, 400, "goal", "yellow");
        Movable(700, 400, 100, 60, "goal", "yellow");
        let player = Player(400, 400, 40, 40);
        player.color = "purple";
    },
    () => {
        Border(40);
        Player(700, 60, 40, 40, "goal", "yellow");
        Movable(600, 40, 60, 400, "enemy", "red");
        Movable(700, 400, 100, 60, "enemy", "red");
        let player = Player(400, 400, 40, 40);
        player.MoveAcceleration = -player.MoveAcceleration;
        player.maxSpeed = -player.maxSpeed;
    },
    () => {
        Border(40);
        Movable(700, 60, 40, 40, "goal", "yellow");
        let fakeEnemy = Player(600, 40, 60, 400, "fake-enemy", "red");
        Movable(700, 400, 100, 60, "enemy", "red");
        Player(400, 400, 40, 40);
        fakeEnemy.onUpdate = deltaTime => {
            if (controls.upKey.pressed) {
                fakeEnemy.speed.y -= fakeEnemy.MoveAcceleration * deltaTime;
                if (fakeEnemy.speed.y < -fakeEnemy.maxSpeed) {
                    fakeEnemy.speed.y = -fakeEnemy.maxSpeed;
                } else if (fakeEnemy.speed.y > 0) {
                    fakeEnemy.speed.y = 0;
                }
            } else if (controls.downKey.pressed) {
                fakeEnemy.speed.y += fakeEnemy.MoveAcceleration * deltaTime;
                if (fakeEnemy.speed.y > fakeEnemy.maxSpeed) {
                    fakeEnemy.speed.y = fakeEnemy.maxSpeed;
                } else if (fakeEnemy.speed.y < 0) {
                    fakeEnemy.speed.y = 0;
                }
            }
        };
        fakeEnemy.onCollision = other => {
            switch (other.name) {
                case "block":
                    stopMotion(fakeEnemy, other);
                    break;
                case "player":
                    setVisible(deathUi, true);
                    break;
            }
        };
    }
];

function loadLevel(levelIndex) {
    hideAllUi();
    currentLevel = levelIndex;
    clearGameObjects();
    levels[levelIndex]();
    levelText.text = "Level: " + (levelIndex + 1);
    levelText.visible = true;
    drawUiElements();
}

function loadNextLevel() {
    loadLevel(currentLevel + 1);

}