const router = require('express').Router();
const bcrypt = require('bcrypt');

router.post('/submit-password', (req, res) => {
    const hash = process.env.WORM_PASSWORD;
    if (!hash) {
        res.status(500).send("There was a problem proccessing the request");
        return;
    }
    let password = req.params.password;
    if (!password)
        password = req.body.password;
    if (!password) {
        res.status(400).send("Requires a password");
        return;
    }
    bcrypt.compare(password, hash, 
    (err, same) => {
        if (err) {
            console.log(err);
            res.status(500).send("There was a problem proccessing the request");
        } else {
            if (same) {
                req.session.worm_approved = true;
                req.session.save();
                let backURL=req.header('Referer') || './dashboard';
                res.redirect(backURL);
            }
            else {
                console.log("worm attempt with worng password");
                res.status(401).send("Worng password");
            }
        }
    })
});

function autherizeMidware (req, res, next) {
    if (req.session.worm_approved || !process.env.WORM_PASSWORD)
        next();
    else
        res.redirect('./login');
}

router.get('/dashboard', autherizeMidware, (req, res) => {
    res.render('worm/worm-dashboard', {title: "Worm Dashboard"})
});

router.get('/login', (req, res) => {
    res.render('worm/worm-login', {title: "Worm Login"});
});


module.exports = router;