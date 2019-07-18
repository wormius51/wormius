const router = require('express').Router();
const Player = require('../games/button-button-button/player');
const Room = require('../games/button-button-button/room');

router.get("/", (req, res, next) => {
    res.render('button-button-button');
});

router.get("/getNumberOfPlayers", (req, res) => {
    res.send({num: Player.getPlayers().length});
});

router.get("/getRooms", (req, res) => {
    res.send(Room.getRooms());
});

module.exports = router;