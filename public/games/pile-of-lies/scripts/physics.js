
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