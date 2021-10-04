
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

function SpinTop (position) {
    let spinTop = GameObject(position, Vector2D(100,100), "clear");
    spinTop.image = images.spintop;
    spinTop.pivot = Vector2D(50, 120);
    spinTop.angleY = 0;
    spinTop.angularVelocity = 0;
    spinTop.wobblAmlitude = 0;
    spinTop.wobbleFriquency = 0;
    spinTop.time = 0;
    spinTop.stability = 100;
    spinTop.momentOfInertia = 1;
    spinTop.lift = 0;
    spinTop.spinning = false;
    spinTop.jumpSpeed = 0;
    spinTop.onUpdate = deltaTime => {
        if (!spinTop.spinning)
            return;
        spinTop.g = 0.1;
        spinTop.time += deltaTime;
        spinTop.angleY += spinTop.angularVelocity * deltaTime;
        spinTop.angleZ = Math.sin(spinTop.wobbleFriquency * spinTop.time) * spinTop.wobblAmlitude;
        if (spinTop.angleY > Math.PI * 2) {
            spinTop.angleY = spinTop.angleY % (Math.PI * 2);
            changeScore(1);
        }
        if (spinTop.angularVelocity) {
            spinTop.wobblAmlitude = Math.pow(0.5, spinTop.angularVelocity * spinTop.stability);
            spinTop.wobbleFriquency = 0.001 / spinTop.wobblAmlitude;
            spinTop.angularVelocity -= deltaTime / (spinTop.momentOfInertia * 500000);
            if (spinTop.angularVelocity < 0)
                spinTop.angularVelocity = 0;
            spinTop.velocity.x = Math.sign(spinTop.velocity.x) * 
            (Math.abs(spinTop.velocity.x) - deltaTime / (spinTop.angularVelocity * 200000));
            spinTop.g = 0.1 / Math.pow(1 / spinTop.angularVelocity, spinTop.lift);
        }

        if (spinTop.angularVelocity <= 0) {
            spinTop.velocity.x = 0;
            spinTop.spinning = false;
            endRun();
        }
    };

    spinTop.jump = () => {
        if (spinTop.grounded && spinTop.spinning)
            spinTop.velocity.y = -spinTop.jumpSpeed;
    }
    return spinTop;
}

function ChargeBar (position) {
    let bar = Block(position, Vector2D(300, 50));
    bar.color = "purple";
    let piston = Block(copyVector2D(position), Vector2D(10, 40));
    bar.piston = piston;
    piston.solid = false;
    piston.color = "green";
    piston.position.y += 5;
    piston.position.x += 5;
    bar.charge = 0;
    bar.chargeSpeed = 0.01;
    bar.time = 0;
    bar.prep = true;
    bar.power = 0.01;
    bar.ready = false;
    bar.onUpdate = deltaTime => {
        if (!bar.prep)
            return; 
        bar.time += deltaTime;
        bar.charge = Math.abs(Math.sin(bar.time * bar.chargeSpeed));
        piston.scale.x = 280 * bar.charge;
        if (controls.upKey.pressed) {
            bar.launch();
        }
    };
    bar.launch = () => {
        if (!bar.prep || !bar.ready)
            return;
        player.angularVelocity = bar.charge * bar.power;
        player.velocity = Vector2D(10, -20);
        player.spinning = true;
        bar.prep = false;
    };
    bar.onCollision = other => {
        if (other == player)
            bar.ready = true;
    }
    return bar;
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
    return block;
}

function Gummy(position, scale) {
    let gummy = Block(position, scale);
    gummy.bouncy = true;
    gummy.color = "purple";
    gummy.onCollision = other => {
        if (other.velocity && normal(other.velocity) != 0)
            plaSound("bounce.flac", other.position);
    }
    return gummy;
}

function TextObject(position, text, fontSize, lifeTime, color) {
    let textObject = GameObject(position, Vector2D(0, 0), color);
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
        gameContext.font = "bold " + (textObject.fontSize * scaleRatio) + "px verda";
        gameContext.fillText(textObject.text, positionOnScreen.x, positionOnScreen.y);
    }
    textObject.zIndex = -1;
    return textObject;
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
    return coin;
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