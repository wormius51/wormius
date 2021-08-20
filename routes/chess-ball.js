const router = require('express').Router();

router.get("/", (req, res) => {
    res.render('chess-ball', {
        title: "Chess Ball",
        description: "Chess where you kick the ball with your pieces.",
        keyWords: ["multiplayer","chess"]
    });
});



module.exports = router;