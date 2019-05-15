
var gameObjects = [];

var currentId = 0;

/**
 * Returns a game object.
 * @param {Number} x 
 * @param {Number} width 
 * @param {String} color 
 * @param {String} name
 */
function GameObject(x, width, color, name) {
    if (!name) name = "game object";
    let obj = {
        id : currentId,
        x : x,
        width : width,
        color : color,
        name : name
    };
    gameObjects.push(obj);
    currentId++;
    return obj;
}

function getObjectById(id) {
    return gameObjects.find(obj => {
       return obj.id == id; 
    });
}

function removeObjectById(id) {
    gameObjects = gameObjects.filter(obj => {
        return obj.id != id;
    });
}

module.exports = GameObject;
module.exports.getObjectById = getObjectById;
module.exports.removeObjectById = removeObjectById;
module.exports.getGameObjects = () => {return gameObjects;};