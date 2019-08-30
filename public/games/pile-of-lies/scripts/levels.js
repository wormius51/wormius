
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
    },
    () => {
        Border(40);
        Patrol([Vector2D(100, 100), Vector2D(100, 300), Vector2D(300, 300), Vector2D(300, 100)], 40, 40, "enemy", "red");
        Patrol([Vector2D(100, 300), Vector2D(300, 300), Vector2D(300, 100), Vector2D(100, 100)], 40, 40, "enemy", "red");
        Patrol([Vector2D(300, 300), Vector2D(300, 100), Vector2D(100, 100), Vector2D(100, 300)], 40, 40, "enemy", "red");
        Patrol([Vector2D(300, 100), Vector2D(100, 100), Vector2D(100, 300), Vector2D(300, 300)], 40, 40, "enemy", "red");

        Patrol([Vector2D(150, 150), Vector2D(150, 260), Vector2D(260, 260), Vector2D(260, 150)], 20, 20, "enemy", "red");
        Patrol([Vector2D(150, 260), Vector2D(260, 260), Vector2D(260, 150), Vector2D(150, 150)], 20, 20, "enemy", "red");
        Patrol([Vector2D(260, 260), Vector2D(260, 150), Vector2D(150, 150), Vector2D(150, 260)], 20, 20, "enemy", "red");
        Patrol([Vector2D(260, 150), Vector2D(150, 150), Vector2D(150, 260), Vector2D(260, 260)], 20, 20, "enemy", "red");
        GameObject(200, 200, 40, 40, "goal", "yellow");
        Player(500, 200, 30, 30, "player", "blue");
        GameObject(700, 50, 40, 40, "powerup", "pink");
    },
    () => {
        Border(40);
        Patrol([Vector2D(100, 100), Vector2D(100, 300), Vector2D(300, 300), Vector2D(300, 100)], 40, 40, "block", "red");
        Patrol([Vector2D(100, 300), Vector2D(300, 300), Vector2D(300, 100), Vector2D(100, 100)], 40, 40, "block", "red");
        Patrol([Vector2D(300, 300), Vector2D(300, 100), Vector2D(100, 100), Vector2D(100, 300)], 40, 40, "block", "red");
        Patrol([Vector2D(300, 100), Vector2D(100, 100), Vector2D(100, 300), Vector2D(300, 300)], 40, 40, "block", "red");

        Patrol([Vector2D(150, 150), Vector2D(150, 260), Vector2D(260, 260), Vector2D(260, 150)], 20, 20, "block", "red");
        Patrol([Vector2D(150, 260), Vector2D(260, 260), Vector2D(260, 150), Vector2D(150, 150)], 20, 20, "block", "red");
        Patrol([Vector2D(260, 260), Vector2D(260, 150), Vector2D(150, 150), Vector2D(150, 260)], 20, 20, "block", "red");
        Patrol([Vector2D(260, 150), Vector2D(150, 150), Vector2D(150, 260), Vector2D(260, 260)], 20, 20, "block", "red");
        GameObject(200, 200, 40, 40, "goal", "yellow");
        Player(500, 200, 30, 30, "push", "blue");
        let pink = Player(700, 50, 40, 40, "player", "pink");
        pink.onUpdate = () => { };
    },
    () => {
        Border(20, gameWidth, gameHeight - 200);
        Border(40);
        let player = Player(200, 100, 60, 100, "block", "blue");
        player.maxSpeed = 0.5;
        player.onUpdate = deltaTime => {
            if (controls.upKey.pressed) {
                player.speed.y -= player.MoveAcceleration * deltaTime;
                if (player.speed.y < -player.maxSpeed) {
                    player.speed.y = -player.maxSpeed;
                } else if (player.speed.y > 0) {
                    player.speed.y = 0;
                }
            } else if (controls.downKey.pressed) {
                player.speed.y += player.MoveAcceleration * deltaTime;
                if (player.speed.y > player.maxSpeed) {
                    player.speed.y = player.maxSpeed;
                } else if (player.speed.y < 0) {
                    player.speed.y = 0;
                }
            }
        };
        player.onCollision = other => {
            switch (other.name) {
                case "block":
                    stopMotion(player, other);
                    break;
            }
        };
        let pink = Movable(400, 100, 40, 40, "player", "pink", Vector2D(0.2, 0.2));
        pink.onCollision = other => {
            switch (other.name) {
                case "block":
                    bounce(pink, other);
                    break;
                case "goal":
                    if (pink.name == "player")
                        victory();
                    break;
                case "enemy":
                    if (pink.powerup) {
                        other.destroy = true;
                    } else {
                        if (pink.name == "player")
                            pink.destroy = true;
                        else
                            bounce(pink, other);
                    }
                    break;
                case "non-kill":
                    if (pink.powerup) {
                        other.destroy = true;
                    } else {
                        bounce(pink, other);
                    }
                    break;
                case "powerup":
                    pink.powerup = true;
                    pink.color = "white";
                    other.destroy = true;
                    break;
            }
        };
        pink.onDestroy = () => {
            setVisible(deathUi, true);
            drawUiElements();
        };
        let foe = Movable(700, 100, 60, 100, "non-kill", "purple");
        foe.onUpdate = () => {
            foe.position.y = pink.position.y;
        }
        GameObject(45, (gameHeight - 200) / 2, 30, 30, "enemy", "red");
        GameObject(gameWidth - 75, (gameHeight - 200) / 2, 30, 30, "goal", "yellow");
        GameObject(gameWidth - 75, gameHeight - 100, 30, 30, "goal", "yellow");
        GameObject(45, gameHeight - 100, 30, 30, "powerup", "red");
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