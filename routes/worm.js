const router = require('express').Router();
const bcrypt = require('bcrypt');

router.post('/login', (req, res) => {
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
                res.render('worm-dashboard', {title: "Worm Dashboard"});
            }
            else {
                console.log("worm attempt with worng password");
                res.status(401).send("Worng password");
            }
        }
    })
});


module.exports = router;