const router = require('express').Router();
const canvasLand = require('../games/canvas-land');

router.get("/", (req, res, next) => {
    res.render('canvas-land', {
        title: "Canvas Land",
        description: "Draw stuff with other people.",
        keyWords: ["multiplayer","art"]
    });
});

router.get("/getLines", (req, res, next) => {
    res.send(canvasLand.getLines());
});

router.get("/getLimitedLines", (req, res, next) => {
    res.send(canvasLand.getLimitedLines(req.query.startIndex,req.query.maxNumber));
});

module.exports = router;