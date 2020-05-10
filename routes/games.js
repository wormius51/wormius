const router = require('express').Router();

router.get("/", (req, res, next) => {
    res.render('games',
        {
            description: "Play games made by me, the great wormius!",
            title: "Games",
            gameLinks: [
                GameLink("Bee Defence",
                "/games/bee-defence", "/images/gameLinks/bee-defence.png",
                "An arcade game where you collect flowers for the bee race."),
                GameLink("Canvas Land",
                    "/canvas-land", "/images/gameLinks/canvas-land.png",
                    "A multiplayer canvas where you can draw with your friends."),
                GameLink("Jump Dash",
                    "/games/jump-dash", "/images/gameLinks/jump-dash.png",
                    "A game where you jump, and then you dash. Try it."),
                GameLink("Burn Your Brain",
                    "https://wormius51.itch.io/burn-your-brain",
                    "/images/gameLinks/burn-your-brain.png",
                    "A puzzle game from hell. Rotate the pentagons to light the candles on the pentagram."),
                GameLink("Creatures Of Energy",
                    "https://wormius51.itch.io/creatures-of-energy",
                    "/images/gameLinks/creatures-of-energy.png",
                    "A strategy multiplayer game where you grow creatures to destroy the enemy."),
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
                    "A 1 dimensional multiplayer game where you hit enemies or each other to gain upgrade points and unlock skills.")
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
            image: "/images/gameLinks/jump-dash.png"
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

module.exports = router;