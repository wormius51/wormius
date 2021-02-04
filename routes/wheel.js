const router = require('express').Router();
const Player = require('../games/wheel/Player');

router.get("/", (req, res, next) => {
    res.render('wheel', {wheelOwnerId: ""});
});

router.get("/:wheelOwnerId", (req, res, next) => {
    res.render('wheel', {wheelOwnerId: req.params.wheelOwnerId});
});

module.exports = router;