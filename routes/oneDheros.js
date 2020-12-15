const router = require('express').Router();
const GameObject = require('../games/oneDheros/gameObject');

router.get("/", (req, res, next) => {
    res.render('oneDheros');
});

router.get("/getAllObjects", (req, res, next) => {
    res.send(GameObject.getGameObjects());
});

module.exports = router;