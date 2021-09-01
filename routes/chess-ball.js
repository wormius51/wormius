const router = require('express').Router();

router.get("/", (req, res) => {
    res.render('chess-ball', {
        matchId: "",
        title: "Chess Ball",
        description: "Chess where you kick the ball with your pieces.",
        keyWords: ["multiplayer","chess"]
    });
});

router.get("/:matchId", (req, res) => {
    res.render('chess-ball', {
        matchId: req.params.matchId,
        title: "Chess Ball",
        description: "Chess where you kick the ball with your pieces.",
        keyWords: ["multiplayer","chess"]
    });
});



module.exports = router;