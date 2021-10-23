
const spawables = {
    p: params => {
        player = Player(Vector2D(+params[1], +params[2]));
    },
    b: params => {
        let block = Block();
        applyParams(block, params);
    },
    g: params => {
        let block = Gummy();
        applyParams(block, params);
    },
    e: params => {
        let enemy = Enemy();
        applyParams(enemy, params);
    },
    fe: params => {
        let enemy = FlyingEnemy();
        applyParams(enemy, params);
    },
    l: params => {
        let enemy = RocketLauncher();
        applyParams(enemy, params);
    },
    gl: params => {
        Goal(Vector2D(+params[1], +params[2]));
    },
    c: params => {
        Coin(Vector2D(+params[1], +params[2]));
    },
    u: params => {
        UpDashPickup(Vector2D(+params[1], +params[2]));
    },
    s: params => {
        SideDashPickup(Vector2D(+params[1], +params[2]));
    },
    t: params => {
        TextObject(Vector2D(+params[1], +params[2]), params[3].substr(1, params[3].length - 2), +params[4]);
    },
    i: params => {
        ImageObject(Vector2D(+params[1], +params[2]), Vector2D(+params[3], +params[4]), params[5].substr(1, params[5].length - 2));
    },
    pl: params => {
        let portal = Portal();
        applyParams(portal, params);
        for (let i = 0; i < params.length; i++) {
            if (params[i].indexOf("\"") != -1) {
                let exitParams = params[i].substr(1, params[i].length - 2).match(/[^"\s]+/g);
                exitParams.unshift("pe");
                applyParams(portal.exit, exitParams);
                break;
            }
        }
    }
}

function applyParams (gameObject, params) {
    gameObject.position.x = +params[1];
    gameObject.position.y = +params[2];
    gameObject.scale.x = +params[3];
    gameObject.scale.y = +params[4];
    if (params.length < 8)
        return;
    gameObject.horizontalSpeed = +params[5];
    gameObject.verticalSpeed = +params[6];
    gameObject.walkTime = +params[7];
}

function parseBuild (data, levelName) {
    if (levelName) {
        clearGameObjects();
        eyeBoxesKilled = 0;
        levelScore = 0;
    }
    let spawnRegex = /[a-z]+\s[^a-z]+\s+("([^"]+)"(\s+[^a-z]+)*)?/g;
    let matches = data.match(spawnRegex);
    matches.forEach(m => {
        let params = m.match(/[^\s"]+|"[^"]+"/g);
        if (spawables[params[0]])
            spawables[params[0]](params);
    });
    if (levelName) {
        camera = Camera();
        levelText.text = "Level: " + levelName;
        drawUiElements();
    }
}

function levelToString () {
    let s = "";
    gameObjects.forEach(gameObject => {
        if (gameObject.getString)
            s += gameObject.getString() + " ";
    });
    return s;
}