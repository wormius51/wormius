const router = require('express').Router();

router.get("/", (req, res) => {
    res.render('chess-ball', {
        matchId: "",
        startPosition: req.query.pos,
        title: "Chess Ball",
        description: "Chess where you kick the ball with your pieces.",
        keyWords: ["multiplayer","chess"]
    });
});

router.get("/:matchId", (req, res) => {
    res.render('chess-ball', {
        matchId: req.params.matchId,
        startPosition: "",
        title: "Chess Ball",
        description: "Chess where you kick the ball with your pieces.",
        keyWords: ["multiplayer","chess"]
    });
});



module.exports = router;