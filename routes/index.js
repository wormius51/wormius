const router = require('express').Router();

router.get("/", (req, res, next) => {
    res.render('home', {title: "Home"});
});

router.get("/about", (req, res, next) => {
    res.render('about', {
        title: "About", 
        SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
        keywords: [
            "freelancer",
            "Javascript",
            "Godot",
            "Unity",
            "Game development"
        ]
    });
});

router.get("/email-received", (req, res, next) => {
    res.render('email-received', {title: "Email Received"});
});

router.use("/contact", require('./contact'));

module.exports = router;