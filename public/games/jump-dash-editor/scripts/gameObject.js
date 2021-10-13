
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
    player.isPlayer = true;
    player.upDash = false;
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
        if (!player.isDashing)
            player.stopDash();
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
        if (player.upDash)
            player.velocity.y = -player.dashSpeed;
        else {
            player.velocity.x = player.direction * player.dashSpeed;
            if (!player.velocity.x) 
                player.velocity.x = player.dashSpeed;
            player.g = 0;
            player.velocity.y = 0;
        }
        
        player.dashTime += deltaTime;
        let b = player.upDash ? 144 : 255;
        let r = 100 * player.dashTime / player.maxDashTime;
        let g = player.upDash ? 238 : r;
        player.color = "rgb(" + r + "," + g + "," + b + ")";
        let scale = 50 * (player.maxDashTime / (player.maxDashTime + player.dashTime));
        if (player.upDash)
            rescale(player, Vector2D(scale, 50));
        else
            rescale(player, Vector2D(50, scale));
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
            if (other.onPick)
                other.onPick(player);
        }
    }
    player.stopDash = () => {
        player.color = player.upDash ? "lightgreen" : "blue";
        rescale(player, Vector2D(50, 50));
    };
    player.onDeath = death;
    player.getString = () => {
        return "p " + player.position.x + " " + player.position.y;
    }
    return player;
}

function Camera() {
    let camera = GameObject(copyVector2D(player.position), Vector2D(0, 0), "clear");
    camera.g = 0;
    camera.solid = false;
    camera.followPresentage = 0.05;
    camera.onUpdate = deltaTime => {
        let center = centerOfObject(player);
        mulVectorNum(camera.velocity, 0);
        addVectors(camera.velocity, center);
        subVectors(camera.velocity, camera.position);
        mulVectorNum(camera.velocity, camera.followPresentage);
    };
    return camera;
}

function Block(position, scale) {
    let block = GameObject(position, scale, "black");
    block.g = 0;
    block.getString = () => {
        return "b " + block.position.x + " " + block.position.y +
        " " + block.scale.x + " " + block.scale.y;
    }
    block.scaleable = true;
    return block;
}

function Door (position, levelIndex) {
    let door = Block(position, Vector2D(50, 50));
    door.color = "green";
    door.levelIndex = levelIndex ? levelIndex : 0;
    let text = TextObject(Vector2D(position.x + 10, position.y + 40), (levelIndex + 1) + "", 50);
    text.zIndex = 10;
    door.onCollision = other => {
        if (other.isPlayer)
            loadLevel(door.levelIndex);
    }
    door.onUpdate = () => {
        if (reachedLevel < door.levelIndex) {
            door.destroy = true;
            text.destroy = true;
        }
    }
    door.getString = undefined;
    return door;
}

function Gummy(position, scale) {
    let gummy = Block(position, scale);
    gummy.bouncy = true;
    gummy.color = "purple";
    gummy.onCollision = other => {
        if (other.velocity && normal(other.velocity) != 0)
            plaSound("bounce.flac", other.position);
    }
    gummy.getString = () => {
        return "g " + gummy.position.x + " " + gummy.position.y +
        " " + gummy.scale.x + " " + gummy.scale.y;
    }
    return gummy;
}

function Enemy(position, walkSpeed) {
    if (walkSpeed == undefined) walkSpeed = 3;
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
    enemy.getString = () => {
        return "e " + enemy.position.x + " " + enemy.position.y +
        " " + enemy.scale.x + " " + enemy.scale.y + " " + " " + enemy.walkSpeed;
    }
    enemy.scaleable = true;
    return enemy;
}

function FlyingEnemy(position, speed) {
    if (!speed)
        speed = 3;
    let flyingEnemy = Enemy(position, speed);
    flyingEnemy.g = 0;
    flyingEnemy.getString = () => {
        return "fe " + flyingEnemy.position.x + " " + flyingEnemy.position.y +
        " " + flyingEnemy.scale.x + " " + flyingEnemy.scale.y + " " + flyingEnemy.walkSpeed;
    }
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
    hunter.getString = undefined;
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
    rocketLauncher.getString = () => {
        return "l " + rocketLauncher.position.x + " " + rocketLauncher.position.y;
    }
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
    eyeBox.time = 4000;
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
                eyeBox.bottom.destroy = true;
                break;
        }
    };

    eyeBox.onUpdate(0);
    return eyeBox;
}

function TextObject(position, text, fontSize, lifeTime, color) {
    let textObject = GameObject(position, Vector2D(0, 0), "clear");
    textObject.solid = false;
    textObject.g = 0;
    textObject.text = text + "";
    textObject.time = 0;
    textObject.lifeTime = lifeTime;
    if (!fontSize) fontSize = 30;
    if (!color) color = "black";
    textObject.fontSize = fontSize;
    textObject.textColor = color;
    textObject.onUpdate = deltaTime => {
        textObject.time += deltaTime;
        if (textObject.time >= textObject.lifeTime) {
            textObject.destroy = true;
        }
        textObject.scale.y = textObject.fontSize * scaleRatio;
        textObject.scale.x = textObject.fontSize * scaleRatio * textObject.text.length * 0.4;
    };
    textObject.onDraw = positionOnScreen => {
        gameContext.font = "bold " + (textObject.fontSize * scaleRatio) + "px verda";
        gameContext.fillStyle = textObject.textColor;
        gameContext.fillText(textObject.text, positionOnScreen.x, positionOnScreen.y + (textObject.fontSize * scaleRatio));
    }
    textObject.zIndex = -1;
    textObject.scaleable = true;
    textObject.getString = () => {
        return "t " + textObject.position.x + " " + textObject.position.y +
        " \"" + textObject.text + "\" " + textObject.fontSize;
    };
    return textObject;
}

function Goal(position) {
    let goal = GameObject(position, Vector2D(50, 300), "yellow");
    goal.finishLevel = true;
    goal.getString = () => {
        return "gl " + goal.position.x + " " + goal.position.y;
    }
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
    coin.getString = () => {
        return "c " + coin.position.x + " " + coin.position.y;
    }
    return coin;
}

function UpDashPickup (position) {
    let pickup = Coin(position, 50);
    pickup.onPick = other => {
        if (other.isPlayer)
            other.upDash = true;
    }
    pickup.color = "lightgreen";
    pickup.getString = () => {
        return "u " + pickup.position.x + " " + pickup.position.y;
    }
    return pickup;
}

function SideDashPickup (position) {
    let pickup = Coin(position, 50);
    pickup.onPick = other => {
        if (other.isPlayer)
            other.upDash = false;
    }
    pickup.color = "blue";
    pickup.getString = () => {
        return "s " + pickup.position.x + " " + pickup.position.y;
    }
    return pickup;
}


function rescale (gameObject, scale) {
    let objCenterX = gameObject.position.x + gameObject.scale.x / 2;
    let objCenterY = gameObject.position.y + gameObject.scale.y / 2;
    gameObject.scale.x = scale.x;
    gameObject.scale.y = scale.y;
    gameObject.position.x = objCenterX - gameObject.scale.x / 2;
    gameObject.position.y = objCenterY - gameObject.scale.y / 2;
}

function centerOfObject (gameObject) {
    return Vector2D(gameObject.position.x + gameObject.scale.x / 2, gameObject.position.y + gameObject.scale.y / 2);
}