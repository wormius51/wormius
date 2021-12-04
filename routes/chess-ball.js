const router = require('express').Router();

router.get("/", (req, res) => {
    const templateName = req.throughGames ? 'chess-ball/game' : 'chess-ball';
    res.render(templateName, {
        matchId: req.query.mi,
        startPosition: req.query.pos,
        matchData: req.query.md,
        title: "Chess Ball",
        description: "Chess where you kick the ball with your pieces.",
        keyWords: ["multiplayer","chess"]
    });
});

router.get("/editor", (req, res) => {
    res.render('chess-ball-editor', {
        startPosition: req.query.pos,
        title: "Chess Ball Editor",
        description: "Chess where you kick the ball with your pieces.",
        keyWords: ["multiplayer","chess"]
    });
});

module.exports = router;