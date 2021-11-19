const router = require('express').Router();

router.get("/", (req, res, next) => {
    res.render('privacy-policy', {title: "Privacy Policy"})
});

module.exports = router;