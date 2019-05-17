
var gameObjects = [];

var currentId = 0;

/**
 * Returns a game object.
 * @param {Number} x 
 * @param {Number} width 
 * @param {String} color 
 * @param {String} name
 */
function GameObject(x, width, color, name, type) {
    if (!name) name = "game object";
    if (!color) color = "rgba(0,0,0,0)";
    let obj = {
        new : true,
        update : false,
        id : currentId,
        x : x,
        speed : 0,
        acceleration : 0,
        drag : 0.01,
        width : width,
        color : color,
        name : name,
        type : type,
        hp : 100,
        onUpdate : () => {},
        onCollision : other => {},
        onDeath : () => {}
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
    return id;
}

function filterObjects() {
    gameObjects = gameObjects.filter(obj => {
        return !obj.destroy;
    });
    return gameObjects;
}

module.exports = GameObject;
module.exports.getObjectById = getObjectById;
module.exports.removeObjectById = removeObjectById;
module.exports.getGameObjects = () => {return gameObjects;};
module.exports.filterObjects = filterObjects;