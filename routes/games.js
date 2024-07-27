const router = require('express').Router();

router.get("/", (req, res, next) => {
    res.render('games',
        {
            description: "Play games made by me, the great wormius!",
            title: "Games",
            gameLinks: [
                GameLink("Toggle Tile",
                    "https://wormius51.itch.io/square-puzzle", "/images/gameLinks/toggle-tile.png",
                    "A puzzle game where you click tiles to try and turn them all on."),
                GameLink("Chess Ball", 
                    "/games/chess-ball", "/images/gameLinks/chess-ball.png", 
                    `A chess variant where you kick the ball with your pieces.
                    (This position is a puzzle by jacobdk)`),
                GameLink("Pipe Pop",
                    "https://wormius51.itch.io/pipe-pop", "/images/gameLinks/pipe-pop.png",
                    "Rotate pipes to connect and pop them to win score."),
                GameLink("Creatures Of Energy",
                    "https://store.steampowered.com/app/2066690/Creatures_of_Energy/",
                    "/images/gameLinks/creatures-of-energy.png",
                    "A strategy multiplayer game where you grow creatures to destroy the enemy."),
                GameLink("Tribute Chess",
                    "/games/tribute-chess", "/images/gameLinks/tribute-chess.png",
                    "I made chess pieces out of people."),
                GameLink("Really Bad Flying Machine",
                    "/games/really-bad-flying-machine", "/images/gameLinks/really-bad-flying-machine.png",
                    "A puzzle game where you play as a flying machine. You can shoot your propellers off but lose the ability to move."),
                GameLink("Photinos",
                    "https://wormius51.itch.io/photinos", "/images/gameLinks/photinos.png",
                    "A puzzle game were you move as lasers and split to different colors."),
                GameLink("Jump Dash",
                    "/games/jump-dash", "/images/gameLinks/jump-dash.png",
                    "A game where you jump, and then you dash. Try it."),
                GameLink("Burn Your Brain",
                    "https://wormius51.itch.io/burn-your-brain",
                    "/images/gameLinks/burn-your-brain.png",
                    "A puzzle game from hell. Rotate the pentagons to light the candles on the pentagram."),
                GameLink("Tha Wheel", 
                "/wheel", "/images/gameLinks/tha-wheel.png",
                "A wheel to which you can invite people to join to. You then spin it to get a random player."),
                /*GameLink("Canvas Land", // Posted to newgrounds and people drew nudes. So have to not link it here.
                    "/canvas-land", "/images/gameLinks/canvas-land.png",
                    "A multiplayer canvas where you can draw with your friends."),*/
                GameLink("Tactical Tactics",
                    "/games/tactical-tactics",
                    "/images/gameLinks/tactical-tactics.png",
                    "A chrome extension that helps you train your chess tactics skills."),
                GameLink("Morsing Around",
                    "https://wormius51.itch.io/morsing-around",
                    "/images/gameLinks/morsing-around.png",
                    "Beep Beep Beep. In this game you push the button to write the text in morse (try to find the secret)."),
                GameLink("oneDheros",
                    "/oneDheros",
                    "/images/gameLinks/oneDheros.png",
                    "A 1 dimensional multiplayer game where you hit enemies or each other to gain upgrade points and unlock skills."),
                GameLink("Bee Defence",
                    "https://wormius51.itch.io/bee-defence", "/images/gameLinks/bee-defence.png",
                    "An arcade game where you collect flowers for the bee race.")
            ]
        });
});

router.get("/tactical-tactics", (req, res, next) => {
    res.render('games', {
        description: "A chrome extension that helps you improve your chess tactics skills.",
        title: "Tactical Tactics",
        gameLinks: [
            GameLink("Tactical Tactics Free",
                "https://chrome.google.com/webstore/detail/tactical-tactics-free/keiookbkgfkglpbooppdhoainanmpcmj",
                "/images/gameLinks/tactical-tactics.png",
                "A free version with two game modes."),
            GameLink("Tactical Tactics",
                "https://chrome.google.com/webstore/detail/tactical-tactics/imoijdpipccgjlimefkhkggooecpidpp",
                "/images/gameLinks/tactical-tactics.png",
                "A paid version with five game modes."),
        ]
    });
});

function GameLink(name, url, imageSrc, description) {
    let gameLink = {
        name: name,
        url: url,
        imageSrc: imageSrc,
        description: description
    };
    return gameLink;
}

router.get("/jump-dash", (req, res, next) => {
    res.render('jump-dash',
        {
            title: "Jump Dash",
            description: "A game where you jump, and then you dash.",
            keywords: ["game", "platformer", "webgame"],
            image: "/images/gameLinks/jump-dash.png",
            icon: "/games/jump-dash-st/images/dash.png"
        });
});

router.get("/jump-dash-fullscreen", (req, res, next) => {
    res.render('jump-dash-fullscreen',
        {
            title: "Jump Dash Fullscreen",
            description: "A game where you jump, and then you dash.",
            keywords: ["game", "platformer", "webgame"],
            image: "/images/gameLinks/jump-dash.png"
        });
});

router.get("/bee-defence", (req, res, next) => {
    res.render('bee-defence',
        {
            title: "Bee Defence",
            description: "An arcade game where you collect flowers for the bee race.",
            keywords: ["game", "arcade", "highscore", "webgame"],
            image: "/images/gameLinks/bee-defence.png"
        });
});

router.get("/really-bad-flying-machine", (req, res, next) => {
    res.render('really-bad-flying-machine',
        {
            title: "Really Bad Flying Machine",
            description: "A game where you shoot off your own propellers",
            keywords: ["game", "puzzle", "webgame"],
            image: "/images/gameLinks/really-bad-flying-machine.png"
        });
});

router.use('/chess-ball', gamesMidwere, require('./chess-ball'));

function gamesMidwere (req, res, next) {
    req.throughGames = true;
    next();
}

module.exports = router;