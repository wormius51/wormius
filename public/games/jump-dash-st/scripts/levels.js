
var reachedLevel = 0;
var currentLevel = 0;

const levels = [
    //tutorial 1
    () => {
        player = Player(Vector2D(100, 100));
        Block(Vector2D(-300, 200), Vector2D(3000, 60));
        let backBlock = Block(Vector2D(-300, -100), Vector2D(50, 350));
        backBlock.onUpdate = () => {
            if (reachedLevel > 0)
                backBlock.destroy = true;
        };
        TextObject(Vector2D(-150, 50), "press " + controls.leftKey.key + " and " + controls.rightKey.key + " to move.", 60, undefined, "black");
        Block(Vector2D(1000, 100), Vector2D(100, 150));
        TextObject(Vector2D(600, -50), "press " + controls.upKey.key + " to jump.", 60, undefined, "black");
        Block(Vector2D(1700, 100), Vector2D(100, 150));
        Block(Vector2D(2100, 0), Vector2D(100, 250));
        TextObject(Vector2D(1500, -50), "press " + controls.upKey.key + " twice to dash.", 60, undefined, "black");
        Goal(Vector2D(2600, 200));
        Coin(Vector2D(2700,0));
        Block(Vector2D(-600, 500), Vector2D(3000, 60));
        Block(Vector2D(-600, 0), Vector2D(50, 550));
        for (let i = 1; i < levels.length - 1; i++) {
            Door(Vector2D(-600 + 200 * i, 340), i);
        }
    },
    //tutorial 2
    () => {
        player = Player(Vector2D(100, 100));
        Block(Vector2D(-300, 200), Vector2D(3000, 60));
        Block(Vector2D(-300, -100), Vector2D(50, 350));
        TextObject(Vector2D(-150, 50), "You can kill enemies with your dash", 60, undefined, "black");
        Block(Vector2D(1000, 100), Vector2D(400, 150));
        Coin(Vector2D(600, -120));
        FlyingEnemy(Vector2D(800, -120));
        FlyingEnemy(Vector2D(1000, 0));
        FlyingEnemy(Vector2D(1100, -60));
        FlyingEnemy(Vector2D(1200, -120));
        TextObject(Vector2D(1300, -50), "You get an extra dash after killing.", 60, undefined, "black");
        Block(Vector2D(1700, 100), Vector2D(100, 150));
        let e = FlyingEnemy(Vector2D(2000, -100), 1);
        e.onDeath = () => {
            setTimeout(() => {
                let ne = FlyingEnemy(Vector2D(2000, -100), 1);
                ne.onDeath = e.onDeath;
            }, 1000);
        };
        Block(Vector2D(2300, 0), Vector2D(100, 250));
        Goal(Vector2D(2600, 200));
    },
    //climb and fall
    () => {
        player = Player(Vector2D(100, 100));
        Block(Vector2D(-300, 200), Vector2D(3000, 200));
        Block(Vector2D(-300, -100), Vector2D(50, 350));
        Block(Vector2D(300,0),Vector2D(400,100));
        Enemy(Vector2D(-100,-300)).maxWalkTime = 700
        Block(Vector2D(300,-200),Vector2D(200,100));
        Block(Vector2D(-100,-100),Vector2D(200,100));
        Enemy(Vector2D(800,0),-3);
        Block(Vector2D(600,-200),Vector2D(200,100));
        Block(Vector2D(900,100),Vector2D(100,150));
        FlyingEnemy(Vector2D(900,-50));
        Block(Vector2D(1100,100),Vector2D(400,150));
        Block(Vector2D(1100,-250),Vector2D(800,300));
        Coin(Vector2D(1600, 100));
        Block(Vector2D(1700,0),Vector2D(200,250));
        Enemy(Vector2D(1300,-300));
        Enemy(Vector2D(1500,-300));
        Goal(Vector2D(2600, 0));
    },
    //down maze
    () => {
        player = Player(Vector2D(100, 100));
        Block(Vector2D(-300, 200), Vector2D(500, 60));
        Block(Vector2D(-300, -100), Vector2D(50, 350));
        Block(Vector2D(200, 300), Vector2D(300, 60));
        Enemy(Vector2D(300,250)).maxWalkTime = 750;
        Block(Vector2D(570,0),Vector2D(60,800));
        Block(Vector2D(150,200),Vector2D(60,800));
        Block(Vector2D(300, 500), Vector2D(300, 60));
        Enemy(Vector2D(300,450)).maxWalkTime = 750;
        Block(Vector2D(200, 700), Vector2D(300, 60));
        Enemy(Vector2D(300,650)).maxWalkTime = 750;
        Block(Vector2D(150, 950), Vector2D(1000, 60));
        Coin(Vector2D(1250,1100));
        Block(Vector2D(700,850),Vector2D(400,150));
        Enemy(Vector2D(700,800)).maxWalkTime = 750;
        Enemy(Vector2D(900,800)).maxWalkTime = 750;
        Block(Vector2D(1200,700),Vector2D(200,60));
        Enemy(Vector2D(1200,650)).maxWalkTime = 750;
        Block(Vector2D(900,600),Vector2D(200,60));
        Enemy(Vector2D(900,550)).maxWalkTime = 750;
        Block(Vector2D(1200,500),Vector2D(300,60));
        Enemy(Vector2D(1200,450)).maxWalkTime = 750;
        Goal(Vector2D(1440,200));
    },
    //fire jump
    () => {
        player = Player(Vector2D(100, 100));
        Block(Vector2D(-300, -100), Vector2D(50, 350));
        Block(Vector2D(-300, 200), Vector2D(1000, 60));
        Block(Vector2D(300, 0), Vector2D(1000, 60));
        Enemy(Vector2D(200,-50)).maxWalkTime = 5000;
        Enemy(Vector2D(200,100)).maxWalkTime = 5000;
        Enemy(Vector2D(200,500)).maxWalkTime = 5000;
        Enemy(Vector2D(200,550)).maxWalkTime = 5000;
        Enemy(Vector2D(1200,-50)).maxWalkTime = 1000;
        Enemy(Vector2D(1200,100)).maxWalkTime = 500;
        Block(Vector2D(0, 400), Vector2D(700, 60));
        for (let i = 0; i < 6; i++) {
            FlyingEnemy(Vector2D(700 + i * 60,400)).maxWalkTime = 250;
        }
        Coin(Vector2D(1000,300));
        Block(Vector2D(1060, 400), Vector2D(700, 60));
        Block(Vector2D(1060, -250), Vector2D(60, 700));
        TextObject(Vector2D(850, -200), "( ;", 50);
        Goal(Vector2D(1100, 50));
        Block(Vector2D(0, 570), Vector2D(1740, 60));
    },
    //tunnels of hell
    () => {
        player = Player(Vector2D(100, 100));
        EditorPortal(Vector2D(100, 400));
        Block(Vector2D(-300, 200), Vector2D(500, 60));
        Block(Vector2D(-300, -600), Vector2D(50, 850));
        Block(Vector2D(400, 70), Vector2D(500, 60));
        Block(Vector2D(400, -600), Vector2D(500, 560));
        Enemy(Vector2D(400,10));
        Block(Vector2D(1200, -530), Vector2D(500, 560));
        Block(Vector2D(1200, 140), Vector2D(500, 60));
        Enemy(Vector2D(1200,80));
        Block(Vector2D(2000, 70), Vector2D(500, 60));
        Enemy(Vector2D(2000,10));
        Enemy(Vector2D(2000,60));
        Block(Vector2D(2000, -600), Vector2D(500, 560));
        Block(Vector2D(2800, -530), Vector2D(500, 560));
        Block(Vector2D(2800, 120), Vector2D(500, 60));
        Enemy(Vector2D(2800,60));
        Block(Vector2D(3600, 70), Vector2D(500, 60));
        Enemy(Vector2D(3600,10));
        Block(Vector2D(3600, -570), Vector2D(500, 560));
        Enemy(Vector2D(4300,40));
        Block(Vector2D(4300,100),Vector2D(60,60));
        Block(Vector2D(4300,210),Vector2D(500,60));
        Coin(Vector2D(4370,60));
        Goal(Vector2D(4300, -200));
    },
    //rocket Launchers
    () => {
        player = Player(Vector2D(100, 100));
        Block(Vector2D(-300, 200), Vector2D(500, 200));
        Block(Vector2D(-300, -100), Vector2D(50, 350));
        RocketLauncher(Vector2D(500,100));
        Block(Vector2D(400, 200), Vector2D(400, 200));
        RocketLauncher(Vector2D(1300,-100));
        Block(Vector2D(1100, 200), Vector2D(400, 200));
        Block(Vector2D(1400, 50), Vector2D(400, 200));
        Block(Vector2D(1600, 350), Vector2D(200, 200));
        Block(Vector2D(1400, 600), Vector2D(700, 50));
        Block(Vector2D(1900,-200),Vector2D(100,820));
        Enemy(Vector2D(1700,500)).maxWalkTime = 200;
        Block(Vector2D(1500, 780), Vector2D(1100, 100));
        Block(Vector2D(2500, 700), Vector2D(800, 180));
        Block(Vector2D(3000,550),Vector2D(200,50));
        Block(Vector2D(2800,400),Vector2D(200,50));
        Block(Vector2D(3000,250),Vector2D(200,50));
        Block(Vector2D(2800,100),Vector2D(200,50));
        Coin(Vector2D(2040,560));
        RocketLauncher(Vector2D(2040,300)).spawnTime = 3000;
        RocketLauncher(Vector2D(3000,-100)).spawnTime = 3000;
        Block(Vector2D(2600,-50),Vector2D(200,50));
        Goal(Vector2D(2600,-350));
    },
    //ultra combo
    () => {
        player = Player(Vector2D(100, 100));
        Block(Vector2D(-300, 300), Vector2D(500, 60));
        Block(Vector2D(-300, 0), Vector2D(50, 350));
        Block(Vector2D(0, 200), Vector2D(100, 150));
        FlyingEnemy(Vector2D(200,-50));
        FlyingEnemy(Vector2D(450,0));
        FlyingEnemy(Vector2D(700, 50));
        FlyingEnemy(Vector2D(950, 100));
        FlyingEnemy(Vector2D(1300, 150));
        FlyingEnemy(Vector2D(1550, 200));
        FlyingEnemy(Vector2D(1800, 200));
        Block(Vector2D(1200,500),Vector2D(2000,100));
        Block(Vector2D(1500, 250), Vector2D(100, 300));
        Coin(Vector2D(1700,400));
        Block(Vector2D(1200,700),Vector2D(2000,100));
        Enemy(Vector2D(1400,600));
        Enemy(Vector2D(1800,600));
        Enemy(Vector2D(2200,600));
        Block(Vector2D(3300,550),Vector2D(300,200));
        Goal(Vector2D(3000,200));
    },
    //level blender
    () => {
        //tunnels of hell
        player = Player(Vector2D(100, 100));
        Block(Vector2D(-300, 200), Vector2D(500, 60));
        Block(Vector2D(-300, -600), Vector2D(50, 850));
        Block(Vector2D(400, 70), Vector2D(500, 60));
        Block(Vector2D(400, -600), Vector2D(500, 560));
        Enemy(Vector2D(400,10));
        //down maze
        Block(Vector2D(1000, 300), Vector2D(300, 60));
        Enemy(Vector2D(1100,250)).maxWalkTime = 750;
        Block(Vector2D(1370,-200),Vector2D(60,1000));
        Block(Vector2D(950,200),Vector2D(60,800));
        Block(Vector2D(1100, 500), Vector2D(300, 60));
        Enemy(Vector2D(1100,450)).maxWalkTime = 750;
        Block(Vector2D(1000, 700), Vector2D(300, 60));
        Enemy(Vector2D(1100,650)).maxWalkTime = 750;
        Block(Vector2D(950, 950), Vector2D(1000, 60));
        //rocket Launchers
        Block(Vector2D(1600,800),Vector2D(200,50));
        Block(Vector2D(1400,650),Vector2D(200,50));
        Block(Vector2D(1600,500),Vector2D(200,50));
        Block(Vector2D(1400,350),Vector2D(200,50));
        Block(Vector2D(1600,200),Vector2D(200,50));
        RocketLauncher(Vector2D(1640,450));
        RocketLauncher(Vector2D(1500,-150));
        //unltra combo
        FlyingEnemy(Vector2D(1700,-50));
        FlyingEnemy(Vector2D(1950,0));
        FlyingEnemy(Vector2D(2200, 50));
        FlyingEnemy(Vector2D(2450, 100));
        FlyingEnemy(Vector2D(2800, 150));   
        Block(Vector2D(2700,500),Vector2D(1000,100));
        //fire jump
        for (let i = 0; i < 6; i++) {
            FlyingEnemy(Vector2D(3700 + i * 60,700)).maxWalkTime = 250;
        }
        Block(Vector2D(3700 + 6 * 60, 300), Vector2D(60, 400));
        Coin(Vector2D(3700 + 6 * 60 + 100, 300));
        Block(Vector2D(3400,700),Vector2D(300,60));
        Block(Vector2D(3500, 860), Vector2D(3000, 60));
        //tutorial 1
        Block(Vector2D(4800, 760), Vector2D(100, 150));
        Block(Vector2D(5500, 760), Vector2D(100, 150));
        Block(Vector2D(5900, 660), Vector2D(100, 250));
        Goal(Vector2D(6400, 860));
    },
    //boss
    () => {
        player = Player(Vector2D(100, 100));
        Block(Vector2D(-300, 200), Vector2D(1000, 60));
        Block(Vector2D(-300, -100), Vector2D(50, 350));
        Block(Vector2D(650, -100), Vector2D(50, 350));
        EyeBox(Vector2D(-100,-200));
        EyeBox(Vector2D(250,-200));
    },
    //gummy
    () => {
        player = Player(Vector2D(100, 100));
        Gummy(Vector2D(200, 100), Vector2D(400, 100));
        Gummy(Vector2D(400, 0), Vector2D(400, 200));
        Block(Vector2D(-300, 200), Vector2D(3000, 60));
        Block(Vector2D(-300, -100), Vector2D(50, 350));
        Block(Vector2D(1000, -100), Vector2D(100, 350));
        Gummy(Vector2D(1200, 100), Vector2D(400, 100));
        Gummy(Vector2D(1400, 0), Vector2D(400, 200));
        Gummy(Vector2D(2100, -50), Vector2D(100, 250));
        Gummy(Vector2D(2150, -150), Vector2D(400, 350));
        Gummy(Vector2D(2400, -150), Vector2D(400, 50));
        Gummy(Vector2D(2500, -300), Vector2D(400, 50));
        Block(Vector2D(2600, -430), Vector2D(50, 50));
        Goal(Vector2D(2600, 200));
        Coin(Vector2D(2700,0));
    },
    //bouncy stairs
    () => {
        player = Player(Vector2D(100, 100));
        Block(Vector2D(50, 350), Vector2D(4000, 50));
        Gummy(Vector2D(750, 300), Vector2D(1000, 50));
        Enemy(Vector2D(1000, 200));
        Enemy(Vector2D(1200, 200));
        for (let i = 0; i < 4; i++) {
            Gummy(Vector2D(250 + 250 * i, 50 - 50 * i), Vector2D(260, 50));
        }
        for (let i = 0; i < 8; i++) {
            Gummy(Vector2D(250 + 250 * 4 + 250 * i, 50 - 50 * 4 + 50 * i), Vector2D(260, 50));
        }
        Enemy(Vector2D(700, -250), 0).g = 0;
        Enemy(Vector2D(750, -250), 0).g = 0;
        Enemy(Vector2D(1050, -250), 0).g = 0;
        Enemy(Vector2D(1100, -250), 0).g = 0;
        Enemy(Vector2D(1550, -300), 0).g = 0;
        Enemy(Vector2D(1600, -300), 0).g = 0;
        Enemy(Vector2D(2550, -100), 0).g = 0;
        Enemy(Vector2D(2600, -100), 0).g = 0;
        for (let i = 0; i < 4; i++) {
            Gummy(Vector2D(3900 + 250 * i, 80 - 50 * i), Vector2D(260, 40));
        }
        Goal(Vector2D(4850, -300));
        Coin(Vector2D(5000, -300));
    },
    //updash
    () => {
        player = Player(Vector2D(100, 100));
        Block(Vector2D(50, 200), Vector2D(400, 50));
        UpDashPickup(Vector2D(300, 100));
        Block(Vector2D(500, -100), Vector2D(400, 50));
        Block(Vector2D(500, -400), Vector2D(400, 50));
        FlyingEnemy(Vector2D(600, -750));
        Block(Vector2D(800, -950), Vector2D(400, 50));
        Goal(Vector2D(1100, -1100));
        Coin(Vector2D(1200, -900));
    },
    () => {
        player = Player(Vector2D(100, 100));
        Block(Vector2D(-300, 200), Vector2D(1200, 60));
        Block(Vector2D(-300, -100), Vector2D(50, 350));
        TextObject(Vector2D(-150, 50), "That's all for now. Will add new levels soon.", 60, undefined, "black");
    }
];

function loadLevel(index) {
    if (!levels[index])
        index = levels.length - 1;
    editorLevel = undefined;
    clearGameObjects();
    eyeBoxesKilled = 0;
    levelScore = 0;
    currentLevel = index;
    levels[currentLevel]();
    camera = Camera();
    levelText.text = "Level: " + (currentLevel + 1);
    drawUiElements();
    if (reachedLevel < currentLevel) {
        reachedLevel = currentLevel;
        saveReachedLevel();
    }
}


function saveReachedLevel() {
    let reachedLevelString = reachedLevel + "";
    let date = new Date(Date.now() + 99999999999999);
    document.cookie = "reachedLevel=" + reachedLevelString + "; path=/; expires=" + date.toUTCString();
}

function loadReachedLevel() {
    let varRgx = /reachedLevel=([^;]+)/
    let reachedLevelString = varRgx.exec(document.cookie);
    if (!reachedLevelString) {
        return;
    }
    reachedLevelString = reachedLevelString[1];
    if (reachedLevelString)
        reachedLevel = +reachedLevelString;
}

window.addEventListener('load', loadReachedLevel);