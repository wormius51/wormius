const router = require('express').Router();
const bcrypt = require('bcrypt');
const post = require('../../scripts/blog/blog-post');
const catchWebException = require('../../scripts/web-exception').catchWebException;

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
                let backURL = '/worm/dashboard';
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
        res.redirect('/worm/login');
}

router.get('/dashboard', autherizeMidware, (req, res) => {
    // On localhost try with dummy data
    if (!process.env.DATABASE_URL) {
        res.render('worm/worm-dashboard', {title: "Worm Dashboard", posts: 
            [
                {id: 1, title: "Banana", preview: "whatever", status: "draft"},
                {id: 2, title: "Apple",preview: "whatever", status: "published"}
            ]
        });
        return;
    }
    post.read({}, ["id", "title", "status", "preview"], {colname: "creationdate", acsending: false}).then(data => {
        res.render('worm/worm-dashboard', {title: "Worm Dashboard", posts: data.rows});
    }).catch(err => {
        catchWebException(res, err);
    });
});

router.get('/login', (req, res) => {
    res.render('worm/worm-login', {title: "Worm Login"});
});

router.use('/post', autherizeMidware, require('./post'));

module.exports = router;