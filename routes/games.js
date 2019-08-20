const router = require('express').Router();

router.get("/", (req, res, next) => {
    res.render('games',
        {
            title: "Games",
            gameLinks: [
                GameLink("Burn Your Brain",
                    "https://wormius51.itch.io/burn-your-brain",
                    "/images/gameLinks/burn-your-brain.png",
                    "A puzzle game from hell. Rotate the pentagons to light the candles on the pentagram."),
                GameLink("Creatures Of Energy",
                    "https://wormius51.itch.io/creatures-of-energy",
                    "/images/gameLinks/creatures-of-energy.png",
                    "A strategy multiplayer game where you grow creatures to destroy the enemy."),
                    GameLink("Tactical Tactics",
                    "https://chrome.google.com/webstore/detail/tactical-tactics-free/keiookbkgfkglpbooppdhoainanmpcmj",
                    "/images/gameLinks/tactical-tactics.png",
                    "A chrome extension that helps you train your chess tactics skills."),
                GameLink("Morsing Around",
                    "https://wormius51.itch.io/morsing-around",
                    "/images/gameLinks/morsing-around.png",
                    "Beep Beep Beep. In this game you push the button to write the text in morse (try to find the secret)."),
                GameLink("oneDheros",
                    "/oneDheros",
                    "/images/gameLinks/oneDheros.png",
                    "A 1 dimensional multiplayer game where you hit enemies or each other to game upgrade points and unlock skills.")
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

module.exports = router;