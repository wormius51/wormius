
/**
 * Returns a game object.
 * @param {Number} id
 * @param {Number} x 
 * @param {Number} width 
 * @param {String} color 
 */
function GameObject(id ,x, width, color) {
    return {
        id : id,
        x : x,
        speed : 0,
        width : width,
        color : color
    };
}

function getObjectById(id) {
    return gameObjects.find(obj => {
       return obj.id == id; 
    });
}

function updateObject(gameObject) {
    if (gameObject.id == myId) {
        myPositionText.innerText = "My Position : " + Math.floor(gameObject.x);
    }
    gameObjects.forEach(element => {
        if (gameObject.id == element.id) {
            element.name = gameObject.name;
            element.x = gameObject.x;
            element.width = gameObject.width;
            element.color = gameObject.color;
        }
    });
}

function removeObjectById(id) {
    gameObjects = gameObjects.filter(obj => {
        return obj.id != id;
    });
}