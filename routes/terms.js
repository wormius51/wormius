const router = require('express').Router();

router.get("/", (req, res, next) => {
    res.render('terms', {title: "Terms"})
});

module.exports = router;