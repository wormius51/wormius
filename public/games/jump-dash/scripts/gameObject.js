
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
        onUpdate: deltaTime => {},
        onCollision: other => {},
        onDeath: () => {},
        onDraw: positionOnScreen => {},
        solid: true,
        grounded: false,
        g: 0.1,
        damage: damage,
        killable: killable
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
        if (player.dashTime == 0) player.dashes++;
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
            player.destroy = true;
        } else if (other.killable && player.isDashing) {
            other.destroy = true;
            player.maxDashes++;
        } else if (other.finishLevel) {
            loadLevel(currentLevel + 1);
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
        let distance = normal(camera.velocity);
        normalize(camera.velocity);

        mulVectorNum(camera.velocity, distance * camera.followPresentage);
    };
    return camera;
}

function Block(position, scale) {
    let block = GameObject(position, scale, "black");
    block.g = 0;
    return block;
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
        let scoreChange = enemy.value * scoreMultiplier;
        changeScore(scoreChange);
        scoreMultiplier++;
        TextObject(copyVector2D(enemy.position), scoreChange, 30 + 3 * Math.log(scoreChange), 1000, "green");
    };
    return enemy;
}

function FlyingEnemy(position, walkSpeed) {
    let flyingEnemy = Enemy(position, walkSpeed);
    flyingEnemy.g = 0;
    return flyingEnemy;
}

function TextObject(position, text, fontSize, lifeTime, color) {
    let textObject = GameObject(position,Vector2D(0,0), color);
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
        gameContext.font = "bold " + textObject.fontSize + "px verda";
        gameContext.fillText(textObject.text, positionOnScreen.x, positionOnScreen.y);
    }
    return textObject;
}

function Goal(position) {
    let goal = GameObject(position, Vector2D(50,300),"yellow");
    goal.finishLevel = true;
    return goal;
}