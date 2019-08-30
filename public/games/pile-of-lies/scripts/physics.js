
function bounce(gameObject, other) {
    if (gameObject.position.x < other.position.x + other.width - 30 && gameObject.position.x + gameObject.width > other.position.x + 30) {
        if (other.position.y < gameObject.position.y) {
            gameObject.position.y = other.position.y + other.height;
            if (gameObject.speed.y < 0) {
                gameObject.speed.y *= -1;
            }
        }  else if (other.position.y > gameObject.position.y) {
            gameObject.position.y = other.position.y - gameObject.height;
            if (gameObject.speed.y > 0) {
                gameObject.speed.y *= -1;
            }
        }
    } else {
        if (other.position.x > gameObject.position.x) {
            gameObject.position.x = other.position.x - gameObject.width;
            if (gameObject.speed.x > 0) {
                gameObject.speed.x *= -1;
            }
        } else if (other.position.x < gameObject.position.x) {
            gameObject.position.x = other.position.x + other.width;
            if (gameObject.speed.x < 0) {
                gameObject.speed.x *= -1;
            }
        }
    }
}

function stopMotion(gameObject, other) {
    if (gameObject.position.x < other.position.x + other.width - 30 && gameObject.position.x + gameObject.width > other.position.x + 30) {
        if (other.position.y < gameObject.position.y) {
            gameObject.position.y = other.position.y + other.height;
            if (gameObject.speed.y < 0) {
                gameObject.speed.y = 0;
            }
        }  else if (other.position.y > gameObject.position.y) {
            gameObject.position.y = other.position.y - gameObject.height;
            if (gameObject.speed.y > 0) {
                gameObject.speed.y = 0;
            }
        }
    } else {
        if (other.position.x > gameObject.position.x) {
            gameObject.position.x = other.position.x - gameObject.width;
            if (gameObject.speed.x > 0) {
                gameObject.speed.x = 0;
            }
        } else if (other.position.x < gameObject.position.x) {
            gameObject.position.x = other.position.x + other.width;
            if (gameObject.speed.x < 0) {
                gameObject.speed.x = 0;
            }
        }
    }
}

function Vector2D(x, y) {
    let vector2D = {
        x: x,
        y: y,
        addVector: other => {
            vector2D.x += other.x;
            vector2D.y += other.y;
        },
        subVector: other => {
            vector2D.x -= other.x;
            vector2D.y -= other.y; 
        },
        numMul: num => {
            vector2D.x *= num;
            vector2D.y *= num;
        },
        normal: () => {
            return Math.sqrt(Math.pow(vector2D.x,2) + Math.pow(vector2D.y,2));
        },
        normalize: () => {
            vector2D.numMul(1 / vector2D.normal());
        },
        equals: other => {
            return vector2D.x == other.x && vector2D.y == other.y;
        }
    }
    return vector2D;
}

function copyVector2D(vector2D) {
    return Vector2D(vector2D.x, vector2D.y);
}