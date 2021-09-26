
var gameObjects = [];
var currentId = 0;

/**
 * Creates a new GameObject and adds it to the gameObjects list.
 * @param {*} position The x and y position of the object in the world.
 * @param {*} scale The width and height of the object.
 * @param {String} color The color to draw the object in.
 * @returns The new GameObject.
 */
function GameObject(position, scale, color, damage, killable) {
    let gameObject = {
        id: currentId,
        position: position,
        velocity: Vector2D(0, 0),
        scale: scale,
        color: color,
        onUpdate: deltaTime => { },
        onCollision: other => { },
        onDeath: () => { },
        onDraw: positionOnScreen => { },
        solid: true,
        grounded: false,
        g: 0.1,
        damage: damage,
        killable: killable,
        zIndex: 0
    };
    currentId++;
    gameObjects.push(gameObject);
    return gameObject;
}

function clearGameObjects() {
    gameObjects = [];
}

function Player(position) {
    let player = GameObject(position, Vector2D(50, 50), "blue");
    if (unlocks.currentSkin) {
        player.image = images[unlocks.currentSkin];
    } 
    player.walkSpeed = 7;
    player.jumpSpeed = 20;
    player.maxJumpTime = 1500;
    player.jumpTime = 0;
    player.endJumpG = player.g * 2;
    player.dashSpeed = 20;
    player.maxDashTime = 200;
    player.dashTime = 0;
    player.direction = 1;
    player.maxDashes = 1;
    player.dashes = 0;
    player.isDashing = false;
    player.onUpdate = deltaTime => {
        if (player.position.y > 2000) player.destroy = true;
        player.color = "blue";
        player.scale.y = 50;
        if (player.grounded) {
            scoreMultiplier = 1;
            player.g = 0.07;
            player.jumpTime = 0;
            player.maxDashes = 1;
            player.dashTime = player.maxDashTime;
            player.dashes = player.maxDashes;
            player.isDashing = false;
        }
        player.velocity.x = 0;
        if (controls.rightKey.pressed) {
            player.direction = 1;
            player.velocity.x += player.walkSpeed;
        }
        if (controls.leftKey.pressed) {
            player.direction = -1;
            player.velocity.x -= player.walkSpeed;
        }
        if (controls.upKey.pressed) {
            if (player.grounded) {
                player.velocity.y = - player.jumpSpeed;
                player.dashTime = player.maxDashTime;
                player.dashes = 0;
                plaSound("8bit_jump.wav");
            } else {
                if (player.dashTime < player.maxDashTime) {
                    player.dash(deltaTime);
                } else {
                    player.isDashing = false;
                    player.jumpTime += deltaTime;
                    if (player.jumpTime >= player.maxJumpTime) {
                        player.g = player.endJumpG;
                    }
                }
            }
        } else {
            player.jumpTime = player.maxJumpTime;
            player.g = player.endJumpG;
            if (player.isDashing) {
                player.isDashing = false;
                player.dashTime = player.maxDashTime;
            }
            if (player.dashes < player.maxDashes) {
                player.dashTime = 0;
            }
        }
    };
    player.dash = deltaTime => {
        if (player.dashTime == 0) {
            player.dashes++;
            plaSound("dash.wav");
        };
        player.isDashing = true;
        player.velocity.x = player.direction * player.dashSpeed;
        if (!player.velocity.x) player.velocity.x = player.dashSpeed;
        player.g = 0;
        player.velocity.y = 0;
        player.dashTime += deltaTime;
        let b = 255;
        let r = 100 * player.dashTime / player.maxDashTime;
        let g = r;
        player.color = "rgb(" + r + "," + g + "," + b + ")";
        player.scale.y = 50 * (player.maxDashTime / (player.maxDashTime + player.dashTime));
    }
    player.onCollision = other => {
        if (other.damage && !player.isDashing) {
            if (!player.invincible)
                player.destroy = true;
        } else if (other.killable && player.isDashing) {
            other.destroy = true;
            player.maxDashes++;
        } else if (other.finishLevel) {
            plaSound("coin.wav");
            loadLevel(currentLevel + 1);
        } else if (other.collectable) {
            other.destroy = true;
            plaSound("coin.wav");
        }
    }
    player.onDeath = death;
    return player;
}

function Camera() {
    let camera = GameObject(copyVector2D(player.position), Vector2D(0, 0), "clear");
    camera.g = 0;
    camera.solid = false;
    camera.followPresentage = 0.05;
    camera.onUpdate = deltaTime => {
        mulVectorNum(camera.velocity, 0);
        addVectors(camera.velocity, player.position);
        subVectors(camera.velocity, camera.position);
        mulVectorNum(camera.velocity, camera.followPresentage);
    };
    return camera;
}

function Block(position, scale) {
    let block = GameObject(position, scale, "black");
    block.g = 0;
    return block;
}

function Gummy(position, scale) {
    let gummy = Block(position, scale);
    gummy.bouncy = true;
    gummy.color = "purple";
    gummy.onCollision = other => {
        if (other.velocity && normal(other.velocity) != 0)
            plaSound("bounce.flac");
    }
    return gummy;
}

function Enemy(position, walkSpeed) {
    if (!walkSpeed) walkSpeed = 3;
    let enemy = GameObject(position, Vector2D(50, 50), "red", true, true);
    enemy.value = 10;
    enemy.walkSpeed = walkSpeed;
    enemy.walkTime = 0;
    enemy.maxWalkTime = 2000;
    enemy.onUpdate = deltaTime => {
        if (enemy.walkTime >= enemy.maxWalkTime) {
            enemy.walkTime = 0;
            enemy.walkSpeed *= -1;
        }
        enemy.velocity.x = enemy.walkSpeed;
        enemy.walkTime += deltaTime;
    };
    enemy.onDeath = () => {
        if (enemy.value) {
            let scoreChange = enemy.value * scoreMultiplier;
            changeScore(scoreChange);
            scoreMultiplier++;
            TextObject(copyVector2D(enemy.position), scoreChange, 30 + 3 * Math.log(scoreChange), 1000, "green").zIndex = 10;
        }
    };
    return enemy;
}

function FlyingEnemy(position, speed) {
    let flyingEnemy = Enemy(position, speed);
    flyingEnemy.g = 0;
    return flyingEnemy;
}

function Hunter(position, speed) {
    let hunter = FlyingEnemy(position, speed);
    hunter.aimTime = 500;
    hunter.time = 0;
    hunter.onUpdate = deltaTime => {
        hunter.time += deltaTime;
        if (hunter.time >= hunter.aimTime) {
            hunter.time = 0;
            mulVectorNum(hunter.velocity, 0);
            addVectors(hunter.velocity, player.position);
            subVectors(hunter.velocity, hunter.position);
            normalize(hunter.velocity);
            mulVectorNum(hunter.velocity, hunter.walkSpeed);
        }
    };
    return hunter;
}

function MasterHunter(position, walkSpeed) {
    let masterHunter = FlyingEnemy(position, walkSpeed);
    masterHunter.value = 100;
    masterHunter.scale = Vector2D(100, 100);
    masterHunter.spawTime = 2000;
    masterHunter.time = 0;
    masterHunter.children = [];
    masterHunter.onUpdate = deltaTime => {
        masterHunter.time += deltaTime;
        if (masterHunter.time >= masterHunter.spawTime) {
            masterHunter.time = 0;
            if (masterHunter.children.length < 3) {
                let hunter = Hunter(copyVector2D(position), masterHunter.walkSpeed).scale = Vector2D(70, 70);
                masterHunter.children.push(hunter);
            }
        }
    };
    return masterHunter;
}

function Rocket(position, speed, lifeTime) {
    if (!speed) speed = 4;
    let rocket = Hunter(position, speed);
    rocket.scale = Vector2D(20, 20);
    rocket.value = 0;
    rocket.livedtime = 0;
    rocket.lifeTime = lifeTime || 400;
    rocket.onCollision = other => {
        if (other.solid && !other.damage && !other.maxDashTime) {
            rocket.destroy = true;
        }
    }
    let moveFunc = rocket.onUpdate;
    rocket.onUpdate = deltaTime => {
        moveFunc(deltaTime);
        rocket.livedtime += deltaTime;
        if (rocket.livedtime >= rocket.lifeTime) {
            rocket.destroy = true;
        }
    };
    return rocket;
}

function RocketLauncher(position) {
    let rocketLauncher = Enemy(position, 0);
    rocketLauncher.value = 30;
    rocketLauncher.scale = Vector2D(40, 70);
    rocketLauncher.color = "orange";
    rocketLauncher.spawTime = 1000;
    rocketLauncher.time = 0;
    rocketLauncher.rocketLifetime = 2000;
    rocketLauncher.onUpdate = deltaTime => {
        rocketLauncher.time += deltaTime;
        if (rocketLauncher.time >= rocketLauncher.spawTime) {
            rocketLauncher.time = 0;
            Rocket(copyVector2D(rocketLauncher.position), 4, rocketLauncher.rocketLifetime);
        }
    };
    return rocketLauncher;
}

var eyeBoxesKilled = 0;

function EyeBox(position, scale) {
    if (!scale) scale = Vector2D(200, 200);
    let eyeBox = GameObject(position, scale, "clear");
    eyeBox.solid = false;
    eyeBox.g = 0;
    eyeBox.hunter = Hunter(copyVector2D(position));
    eyeBox.hunter.onDeath = () => {
        eyeBoxesKilled++;
        if (eyeBoxesKilled >= 2) {
            eyeBoxesKilled = 0;
            let position = copyVector2D(eyeBox.position);
            addVectors(position, Vector2D(-70, -70));
            Goal(position);
        }
    };
    addVectors(eyeBox.hunter.position, eyeBox.hunter.scale);
    eyeBox.top = Block(copyVector2D(position), Vector2D(eyeBox.scale.x + 50, 50));
    eyeBox.bottom = Block(copyVector2D(position), Vector2D(eyeBox.scale.x + 50, 50));
    eyeBox.left = Block(copyVector2D(position), Vector2D(50, eyeBox.scale.y + 50));
    eyeBox.right = Block(copyVector2D(position), Vector2D(50, eyeBox.scale.y + 50));
    eyeBox.wave = -1;
    eyeBox.minions = [];
    eyeBox.time = 0;
    eyeBox.attackTime = 5000;
    eyeBox.onUpdate = deltaTime => {
        eyeBox.positionWalls();

        eyeBox.minions = eyeBox.minions.filter(minion => {
            return !minion.destroy;
        });
        if (eyeBox.minions.length == 0) {
            eyeBox.time += deltaTime;
            if (eyeBox.time >= eyeBox.attackTime) {
                eyeBox.wave++;
                eyeBox.time = 0;
                eyeBox.spawnMinions(eyeBox.wave);
            }
        }
    }

    eyeBox.positionWalls = () => {
        eyeBox.top.position.x = eyeBox.position.x;
        eyeBox.top.position.y = eyeBox.position.y;

        eyeBox.bottom.position.x = eyeBox.position.x;
        eyeBox.bottom.position.y = eyeBox.position.y + eyeBox.scale.y;

        eyeBox.left.position.y = eyeBox.position.y;
        eyeBox.left.position.x = eyeBox.position.x;

        eyeBox.right.position.y = eyeBox.position.y;
        eyeBox.right.position.x = eyeBox.position.x + eyeBox.scale.x;
    };

    eyeBox.dropEnemy = () => {
        let position = copyVector2D(eyeBox.position);
        addVectors(position, Vector2D(-70, -70));
        let enemy = Enemy(position);
        eyeBox.minions.push(enemy);
        return enemy;
    }

    eyeBox.dropRocketLauncher = () => {
        let position = copyVector2D(eyeBox.position);
        addVectors(position, Vector2D(-70, -70));
        eyeBox.minions.push(RocketLauncher(position));
    };

    eyeBox.dropMountedLauncher = () => {
        let enemy = eyeBox.dropEnemy();
        let position = copyVector2D(eyeBox.position);
        addVectors(position, Vector2D(-70, -130));
        let rocketLauncher = RocketLauncher(position);
        eyeBox.minions.push(rocketLauncher);
        rocketLauncher.onUpdate = deltaTime => {
            rocketLauncher.position.x = enemy.position.x;
            rocketLauncher.time += deltaTime;
            if (rocketLauncher.time >= rocketLauncher.spawTime) {
                rocketLauncher.time = 0;
                Rocket(copyVector2D(rocketLauncher.position));
            }
        };
        return rocketLauncher;
    }

    eyeBox.spawnMinions = wave => {
        switch (wave) {
            case 0:
                eyeBox.dropEnemy();
                break;
            case 1:
                eyeBox.dropEnemy();
                eyeBox.dropEnemy();
                break;
            case 2:
                eyeBox.dropRocketLauncher();
                break;
            case 3:
                eyeBox.dropMountedLauncher();
                break;
            case 4:
                eyeBox.bottom.destroy = true;
                break;
        }
    };

    eyeBox.onUpdate(0);
    return eyeBox;
}

function TextObject(position, text, fontSize, lifeTime, color) {
    let textObject = GameObject(position, Vector2D(0, 0), color);
    textObject.solid = false;
    textObject.g = 0;
    textObject.text = text;
    textObject.time = 0;
    textObject.lifeTime = lifeTime;
    if (!fontSize) fontSize = 30;
    textObject.fontSize = fontSize;
    textObject.onUpdate = deltaTime => {
        textObject.time += deltaTime;
        if (textObject.time >= textObject.lifeTime) {
            textObject.destroy = true;
        }
    };
    textObject.onDraw = positionOnScreen => {
        gameContext.font = "bold " + (textObject.fontSize * scaleRatio) + "px verda";
        gameContext.fillText(textObject.text, positionOnScreen.x, positionOnScreen.y);
    }
    textObject.zIndex = -1;
    return textObject;
}

function Goal(position) {
    let goal = GameObject(position, Vector2D(50, 300), "yellow");
    goal.finishLevel = true;
    return goal;
}

function Coin(position, value) {
    if (!value) value = 1000;
    let coin = GameObject(position, Vector2D(30, 30), "yellow");
    coin.value = value;
    coin.collectable = true;
    coin.g = 0;
    coin.onDeath = () => {
        changeScore(coin.value);
        TextObject(copyVector2D(coin.position), coin.value, 30 + 3 * Math.log(coin.value), 1000, "green").zIndex = 10;
    };
    return coin;
}