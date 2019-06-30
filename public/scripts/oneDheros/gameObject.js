
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
    
    let obj = gameObjects.find(element => {
        return gameObject.id == element.id;
    });

    if (obj) {
        obj.name = gameObject.name;
        obj.x = gameObject.x;
        obj.width = gameObject.width;
        obj.color = gameObject.color;
        obj.level = gameObject.level;
        obj.pvp = gameObject.pvp;
        obj.invisible = gameObject.invisible;
        if (obj.pvp) {
            obj.name = "⚔️" + obj.name + "⚔️";
        }
    } else {
        if (gameObject.pvp) {
            gameObject.name = "⚔️" + gameObject.name + "⚔️";
        }
        gameObjects.push(gameObject);
    }

    if (gameObject.id == myId) {
        myPositionText.innerText = "My Position : " + Math.floor(gameObject.x) + " , HP : " + Math.floor(gameObject.hp) + " , Mana : " + Math.floor(gameObject.mana);
        upgradePointsText.innerText = "Upgrade Points : " + Math.floor(gameObject.upgradePoints);
    }

    
}

function removeObjectById(id) {
    gameObjects = gameObjects.filter(obj => {
        return obj.id != id;
    });
}