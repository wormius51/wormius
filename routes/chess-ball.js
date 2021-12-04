const router = require('express').Router();

router.get("/", (req, res) => {
    const templateName = req.throughGames ? 'chess-ball/game' : 'chess-ball';
    res.render(templateName, {
        matchId: req.query.mi,
        startPosition: req.query.pos,
        matchData: req.query.md,
        title: "Chess Ball",
        description: `Win by kicking the ball to the opponents back rank
        or by checkmating (scoring a goal beats checkmate).
        Kick the ball by making a capture move to it.
        The ball moves as the piece that kicks it to an empty square.
        You can leave your king in check (or mate) if you score a goal at the same move.`,
        keyWords: ["multiplayer","chess"],
        image: "/images/gameLinks/chess-ball.png"
    });
});

router.get("/editor", (req, res) => {
    res.render('chess-ball-editor', {
        startPosition: req.query.pos,
        title: "Chess Ball Editor",
        description: "Chess where you kick the ball with your pieces.",
        keyWords: ["multiplayer","chess"],
        image: "/images/gameLinks/chess-ball.png"
    });
});

module.exports = router;