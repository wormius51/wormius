var currentId = 0;
var gameObjects = [];

function clearGameObjects() {
    currentId = 0;
    gameObjects = [];
}

function GameObject(x, y, width, height, name, color) {
    if (!x) x = 0;
    if (!y) y = 0;
    let gameObject = {
        id: currentId,
        position: Vector2D(x, y),
        width: width,
        height: height,
        name: name,
        color: color,
        speed: Vector2D(0, 0),
        onUpdate: deltaTime => { },
        onCollision: other => { },
        onDestroy: () => { },
        destroy: false
    };
    currentId++;
    gameObjects.push(gameObject);
    return gameObject;
}

function Player(x, y, width, height, name, color) {
    if (!name) name = "player";
    if (!color) color = "blue";
    let player = GameObject(x, y, width, height, name, color);
    player.MoveAcceleration = 0.005;
    player.maxSpeed = 1.5;
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
        } else {
            player.speed.y = 0;
        }
        if (controls.leftKey.pressed) {
            player.speed.x -= player.MoveAcceleration * deltaTime;
            if (player.speed.x < -player.maxSpeed) {
                player.speed.x = -player.maxSpeed;
            } else if (player.speed.x > 0) {
                player.speed.x = 0;
            }
        } else if (controls.rightKey.pressed) {
            player.speed.x += player.MoveAcceleration * deltaTime;
            if (player.speed.x > player.maxSpeed) {
                player.speed.x = player.maxSpeed;
            } else if (player.speed.x < 0) {
                player.speed.x = 0;
            }
        } else {
            player.speed.x = 0;
        }
    }
    player.onCollision = other => {
        switch (other.name) {
            case "block":
                bounce(player, other);
                break;
            case "goal":
                if (player.name == "player")
                    victory();
                break;
            case "enemy":
                if (player.powerup) {
                    other.destroy = true;
                } else {
                    if (player.name == "player")
                        player.destroy = true;
                    else
                        bounce(player, other);
                }
                break;
            case "powerup":
                player.powerup = true;
                player.color = "white";
                other.destroy = true;
                break;
            case "player":
                other.speed = copyVector2D(player.speed);
                break;
        }
    }
    player.onDestroy = () => {
        if (player.name == "player")
            setVisible(deathUi, true);
    };
    return player
}

function Block(x, y, width, height) {
    let block = GameObject(x, y, width, height, "block", "purple");
    return block;
}

function Movable(x, y, width, height, name, color, speed) {
    let movable = GameObject(x, y, width, height, name, color);
    if (speed) {
        movable.speed = speed;
    }
    movable.onCollision = other => {
        switch (other.name) {
            case "block":
            case "enemy":
                bounce(movable, other);
                break;
        }
    }
    return movable;
}

function Patrol(points, width, height, name, color, moveSpeed) {
    if (!moveSpeed) moveSpeed = 0.3;
    let object = Movable(points[0].x, points[0].y, width, height, name, color);
    object.points = points;
    object.moveSpeed = moveSpeed;
    object.currentPointIndex = 0;
    object.onUpdate = deltaTime => {
        if (!isFocus) return;
        let nextIndex = (object.currentPointIndex + 1) % object.points.length;
        let nextPoint = object.points[nextIndex];
        let speed = copyVector2D(nextPoint);
        speed.subVector(object.position);
        if (speed.normal() <= moveSpeed * deltaTime) {
            object.currentPointIndex = nextIndex;
        }
        speed.normalize();
        speed.numMul(object.moveSpeed);
        object.speed = speed;
    };
    return object;
}

function Border(thickness, width, height) {
    if (!width) width = gameWidth;
    if (!height) height = gameHeight;
    return [
        Block(0, 0, width, thickness),
        Block(0, height - thickness, width, thickness),
        Block(0, 0, thickness, height),
        Block(width - thickness, 0, thickness, height)
    ]

}

function drawGameObject(gameObject) {
    gameCanvasContext.fillStyle = gameObject.color;
    gameCanvasContext.fillRect(gameObject.position.x, gameObject.position.y, gameObject.width, gameObject.height);
}

function updateGameObject(gameObject, deltaTime) {
    gameObject.onUpdate(deltaTime);
    let tempSpeed = copyVector2D(gameObject.speed);
    tempSpeed.numMul(deltaTime);
    gameObject.position.addVector(tempSpeed);
}

function checkCollisions(gameObject) {
    let collisions = gameObjects.filter(other => {
        if (other.id == gameObject.id) return false;
        return gameObject.position.x <= other.position.x + other.width &&
            gameObject.position.x + gameObject.width >= other.position.x &&
            gameObject.position.y <= other.position.y + other.height &&
            gameObject.position.y + gameObject.height >= other.position.y;
    });
    collisions.forEach(gameObject.onCollision);
}

function updateGameObjects(deltaTime) {
    if (antiblur && !isFocus) return;
    gameObjects.forEach(gameObject => {
        updateGameObject(gameObject, deltaTime);
        checkCollisions(gameObject);
    });
    gameObjects = gameObjects.filter(gameObject => {
        if (gameObject.destroy) {
            gameObject.onDestroy();
        }
        return !gameObject.destroy;
    });
}