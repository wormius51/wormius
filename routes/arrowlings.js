const router = require('express').Router();
const Player = require('../games/arrowlings/player');

router.get("/", (req, res, next) => {
    res.render('arrowlings');
});

router.get("/getAllPlayers", (req, res) => {
    res.send(Player.getPlayers());
});

module.exports = router;