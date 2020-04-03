const router = require('express').Router();

router.get("/", (req, res, next) => {
    var board = {
        lengthX : 10,
        lengthY : 10
    };
    res.render('king-of-the-tile', {board: board});
});

module.exports = router;