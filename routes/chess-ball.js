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
        image: "/images/gameLinks/chess-ball.png",
        icon: "/images/chess-ball/ball.png"
    });
});

router.get("/editor", (req, res) => {
    const templateName = req.throughGames ? 'chess-ball/editor' : 'chess-ball-editor';
    res.render(templateName, {
        startPosition: req.query.pos,
        title: "Chess Ball Editor",
        description: "Set up a board for chess ball. Go wild and make creazy puzzles!",
        keyWords: ["multiplayer","chess"],
        image: "/images/gameLinks/chess-ball.png",
        icon: "/images/chess-ball/ball.png"
    });
});

module.exports = router;