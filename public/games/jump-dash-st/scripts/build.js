
const spawables = {
    p: params => {
        player = Player(Vector2D(+params[1], +params[2]));
    },
    b: params => {
        Block(Vector2D(+params[1], +params[2]), Vector2D(+params[3], +params[4]), +params[5], +params[6]);
    },
    g: params => {
        Gummy(Vector2D(+params[1], +params[2]), Vector2D(+params[3], +params[4]));
    },
    e: params => {
        let enemy = Enemy(Vector2D(+params[1], +params[2]), +params[5]);
        enemy.scale.x = +params[3];
        enemy.scale.y = +params[4];
    },
    fe: params => {
        let enemy = FlyingEnemy(Vector2D(+params[1], +params[2]), +params[5]);
        enemy.scale.x = +params[3];
        enemy.scale.y = +params[4];
    },
    l: params => {
        let enemy = RocketLauncher(Vector2D(+params[1], +params[2]));
        enemy.scale.x = +params[3];
        enemy.scale.y = +params[4];
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
    }
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