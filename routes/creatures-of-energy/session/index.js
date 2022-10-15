const express = require('express');
const router = express.Router();
const faker = require('faker');
const Player = require('../match-making/player');

router.use('/nickName', (req, res, next) => {
    if (req.body.nickName) {
        req.session.nickName = req.body.nickName;
    }
    if (!req.session.nickName) {
        req.session.nickName = faker.name.findName();
    }
    if (req.body.colors) {
        req.session.colors = JSON.parse(req.body.colors);
    }
    if (req.body.eyesStyles) {
        req.session.eyesStyles = JSON.parse(req.body.eyesStyles);
    }
    Player(req.session.id, req.session.nickName,
        req.session.colors, req.session.eyesStyles);
    res.send(req.session.nickName);
});

router.use('/createPlayer', (req, res, next) => {
    var nickName = "";
    var colors = [];
    var eyesStyles = [];
    if (req.body.nickName) {
        nickName = req.body.nickName;
    } else {
        nickName = faker.name.findName();
    }
    if (req.body.colors) {
        colors = JSON.parse(req.body.colors);
    }
    if (req.body.eyesStyles) {
        eyesStyles = JSON.parse(req.body.eyesStyles);
    }
    var player = Player.getPlayerByID(req.body.sessionID);
    if (player) {
        Player.updatePlayer(player, req);
    } else {
        player = Player(req.session.id, nickName, colors, eyesStyles);
    }
    res.send(player);
});

module.exports = router;