
var currentLevel = 0;

const levels = [
    () => {
        player = Player(Vector2D(100, 100));
        Block(Vector2D(-300, 200), Vector2D(3000, 60));
        Block(Vector2D(-300, -100), Vector2D(50, 350));
        TextObject(Vector2D(-150, 50), "press " + controls.leftKey.key + " and " + controls.rightKey.key + " to move.", 60, undefined, "black");
        Block(Vector2D(1000, 100), Vector2D(100, 150));
        TextObject(Vector2D(600, -50), "press " + controls.upKey.key + " to jump.", 60, undefined, "black");
        Block(Vector2D(1700, 100), Vector2D(100, 150));
        Block(Vector2D(2100, 0), Vector2D(100, 250));
        TextObject(Vector2D(1500, -50), "press " + controls.upKey.key + " twice to dash.", 60, undefined, "black");
        Goal(Vector2D(2600, 200));
    },
    () => {
        player = Player(Vector2D(100, 100));
        Block(Vector2D(-300, 200), Vector2D(3000, 60));
        Block(Vector2D(-300, -100), Vector2D(50, 350));
        TextObject(Vector2D(-150, 50), "You can kill enemies with your dash", 60, undefined, "black");
        Block(Vector2D(1000, 100), Vector2D(400, 150));
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
    () => {
        player = Player(Vector2D(100, 100));
        Block(Vector2D(-300, 200), Vector2D(3000, 60));
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
        Goal(Vector2D(2600, 200));
    },
    () => {
        player = Player(Vector2D(100, 300));
        Block(Vector2D(600, 200), Vector2D(40, 500));
        Block(Vector2D(0, 500), Vector2D(900, 60));
        Block(Vector2D(400, 350), Vector2D(600, 60));
        Block(Vector2D(-200, 300), Vector2D(40, 500));
        Block(Vector2D(-900, 600), Vector2D(900, 60));
        Block(Vector2D(-400, 450), Vector2D(600, 60));
        Enemy(Vector2D(500, 0))
        FlyingEnemy(Vector2D(20, 200));
        FlyingEnemy(Vector2D(-100, 200));
    }
];

function loadLevel(index) {
    clearGameObjects();
    changeScore(-score);
    currentLevel = index;
    levels[currentLevel]();
    camera = Camera();
    drawUiElements();
}