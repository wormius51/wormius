const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
    res.render('tutorials',
        {
            title: "Tutorials",
            tutorials: [
                Tutorial("Makeing a game with HTML", "/tutorials/making-a-game-with-html",
                    "/images/tutorials/making-a-game-with-html/thumbnail.png",
                    "Starting with nothing, you will make a simple game in HTML.")
            ]
        });
});

router.get('/:tutname', (req, res) => {
    if (req.params.tutname.match(/\.\./g)) {
        res.status(403).send({error: "Think you are funny?"});
        return;
    }
    let p = path.join(__dirname, '..', 'views', 'tutorials', req.params.tutname + '.ejs');
    ifExists(p, exists => {
        if (exists) {
            res.render(path.join('tutorials', req.params.tutname), { title: req.params.tutname });
        } else {
            res.status(404).send({error: "This page was not found"});
        }
    });
});

function ifExists(path, callback) {
    fs.access(path, fs.F_OK, (err) => {
        let exists = true;
        if (err) {
            exists = false
        }
        callback(exists);
    });
}

function Tutorial(name, url, imageSrc, description) {
    let tutorial = {
        name: name,
        url: url,
        imageSrc: imageSrc,
        description: description
    };
    return tutorial;
}

module.exports = router;