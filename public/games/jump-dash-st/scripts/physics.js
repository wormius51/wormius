const fallSpeedLimit = 30;

function Vector2D(x, y) {
    let vector2D = {
        x: x,
        y: y
    };
    return vector2D;
}

/**
 * Returns a copy of the original vector2D.
 * @param {*} vector2D 
 */
function copyVector2D(vector2D) {
    return Vector2D(vector2D.x, vector2D.y);
}

/**
 * Adds b to a. a is modified.
 * @param {*} a The vector to be modified.
 * @param {*} b The vector to add.
 */
function addVectors(a, b) {
    a.x += b.x;
    a.y += b.y;
}

/**
 * subtracts b from a. a is modified.
 * @param {*} a The vector to be modified.
 * @param {*} b The vector to subtract.
 */
function subVectors(a, b) {
    a.x -= b.x;
    a.y -= b.y;
}

/**
 * Multiplies the x and y of vector2D by number. vector2D is modified.
 * @param {*} vector2D 
 * @param {Number} number 
 */
function mulVectorNum(vector2D, number) {
    vector2D.x *= number;
    vector2D.y *= number;
}

/**
 * Returns the normal (length) of the vector2D.
 * @param {*} vector2D 
 */
function normal(vector2D) {
    return Math.sqrt(Math.pow(vector2D.x, 2) + Math.pow(vector2D.y, 2));
}

/**
 * Changes the normal (length) of the vector2D to 1 but keeps the direction.
 * @param {*} vector2D 
 */
function normalize(vector2D) {
    let n = normal(vector2D);
    if (n != 0)
        mulVectorNum(vector2D, 1 / n);
}

/**
 * Updates the position of the GameObject based on its velocity.
 * @param {*} gameObject 
 */
function moveGameObject(gameObject) {
    addVectors(gameObject.position, gameObject.velocity);
}

function checkCollision(a, b) {
    if (a.id == b.id) return false;
    return a.position.x <= b.position.x + b.scale.x &&
        a.position.x + a.scale.x >= b.position.x &&
        a.position.y <= b.position.y + b.scale.y &&
        a.position.y + a.scale.y >= b.position.y;
}

function collisions(gameObject) {
    gameObject.grounded = false;
    gameObjects.forEach(other => {
        if (checkCollision(gameObject, other)) {
            gameObject.onCollision(other);
            if (gameObject.solid && other.solid) {
                blockGameObject(gameObject, other);
            }
        }
    });
}

function updateGameObject(gameObject, deltaTime) {
    if (gameObject.g && !gameObject.grounded) {
        fallGameObject(gameObject, deltaTime);
    }
    gameObject.onUpdate(deltaTime);
    collisions(gameObject);
    if (gameObject.destroy) {
        gameObject.onDeath();
    }
    moveGameObject(gameObject);
}

function updateGameObjects(deltaTime) {
    gameObjects.forEach(gameObject => {
        updateGameObject(gameObject, deltaTime);
    });
    gameObjects = gameObjects.filter(gameObject => {
        return !gameObject.destroy;
    });
}

function blockGameObject(gameObject, blocker) {
    let gameObjectLeft = gameObject.position.x;
    let gameObjectRight = gameObjectLeft + gameObject.scale.x;
    let blockerLeft = blocker.position.x;
    let blockerRight = blockerLeft + blocker.scale.x;

    let gameObjectTop = gameObject.position.y;
    let gameObjectBottom = gameObjectTop + gameObject.scale.y;
    let blockerTop = blocker.position.y;
    let blockerBottom = blockerTop + blocker.scale.y;

    let dx = Math.min(gameObjectRight - blockerLeft, blockerRight - gameObjectLeft);
    let dy = Math.min(gameObjectBottom - blockerTop, blockerBottom - gameObjectTop);

    //is the collision accuring from the side?
    if (dy > dx) {
        if (gameObject.position.x > blocker.position.x) {
            if (gameObject.velocity.x < 0) {
                if (blocker.bouncy) {
                    gameObject.velocity.x *= -1;
                } else {
                    gameObject.velocity.x = 0;
                }
                gameObject.position.x = blocker.position.x + blocker.scale.x;
            }
        } else {
            if (gameObject.velocity.x > 0) {
                if (blocker.bouncy) {
                    gameObject.velocity.x *= -1;
                } else {
                    gameObject.velocity.x = 0;
                }
                gameObject.position.x = blocker.position.x - gameObject.scale.x;
            }
        }
    } else {
        if (gameObject.position.y > blocker.position.y) {
            if (gameObject.velocity.y < 0) {
                if (blocker.bouncy) {
                    gameObject.velocity.y *= -1;
                } else {
                    gameObject.velocity.y = 0;
                }
                gameObject.position.y = blocker.position.y + blocker.scale.y;
            }
        } else {
            if (gameObject.velocity.y > 0) {
                if (blocker.bouncy) {
                    gameObject.velocity.y *= -1;
                } else {
                    gameObject.velocity.y = 0;
                }
                gameObject.position.y = blocker.position.y - gameObject.scale.y;
                if (!blocker.bouncy) {
                    gameObject.grounded = true;
                }
            }
        }
    }
}

function fallGameObject(gameObject, deltaTime) {
    if (gameObject.velocity.y < fallSpeedLimit)
        gameObject.velocity.y += gameObject.g * deltaTime;
}