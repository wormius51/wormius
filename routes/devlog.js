const router = require('express').Router();

router.get("/", (req, res, next) => {
    res.render('devlog', {title: "Devlog"})
});

module.exports = router;