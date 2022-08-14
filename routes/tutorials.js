const router = require('express').Router();

function Tutorial(name, imageSrc, description) {
    let fileName = name.toLowerCase();;
    fileName = fileName.replace(/\s/g, "-");
    let tutorial = {
        name: name,
        fileName: fileName,
        url: "/tutorials/" + fileName,
        imageSrc: imageSrc,
        description: description
    };
    return tutorial;
}

let tutorials = [
    Tutorial("Making A Game With HTML",
        "/images/tutorials/making-a-game-with-html/thumbnail.png",
        "Starting with nothing, you will make a simple game in HTML."),
    Tutorial("Making A Platformer With HTML",
        "/images/tutorials/making-a-platformer-with-html/thumbnail.png",
        "In this tutorial you will make a platformer with basic physics using HTML."),
    Tutorial("Making A Multiplayer Canvas With Node",
        "/images/gameLinks/canvas-land.png",
        "In this tutorial you will make a real time multiplayer canvas. " +
        "You will use Node.js for the server.")
];

router.get('/', (req, res) => {
    res.render('tutorials',
        {
            description: "Learn how to make games",
            title: "Tutorials",
            tutorials: tutorials
        });
});

router.get('/:tutname', (req, res) => {
    if (req.params.tutname.match(/\.\./g)) {
        res.status(403).send({ error: "Think you are funny?" });
        return;
    }
    let tutorial = tutorials.find(tut => {
        return tut.fileName.match(req.params.tutname);
    });
    if (tutorial) {
        res.render("tutorials/" + tutorial.fileName, { title: tutorial.name, description: tutorial.description, image: tutorial.imageSrc });
    } else {
        res.status(404).send({ error: "Not found." });
    }
});

module.exports = router;