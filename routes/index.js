const router = require('express').Router();

router.get("/", (req, res, next) => {
    res.render('home', {title: "Home"});
});

router.get("/about", (req, res, next) => {
    res.render('about', {title: "About"});
});

module.exports = router;