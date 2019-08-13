const router = require('express').Router();

router.get("/", (req, res, next) => {
    res.render('index', {title: "Home"});
});

router.get("/about", (req, res, next) => {
    res.render('index', {title: "About"});
});

router.get("/games", (req, res, next) => {
    res.render('index', {title: "Games"});
});

module.exports = router;