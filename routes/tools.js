const router = require('express').Router();

function Tool(name, imageSrc, description) {
    let fileName = name.toLowerCase();;
    fileName = fileName.replace(/\s/g, "-");
    const tool = {
        name: name,
        fileName: fileName,
        url: "/tools/" + fileName,
        imageSrc: imageSrc,
        description: description
    };
    return tool;
}

let tools = [
    Tool("Replacer",
        "/images/tools/replacer/thumbnail.jpg",
        "Replaces strings in a text using a regular expression.")
];

router.get('/', (req, res) => {
    res.render('tools',
        {
            description: "Helpful online tools",
            title: "Tools",
            tools: tools
        });
});

router.get('/:toolname', (req, res) => {
    if (req.params.toolname.match(/\.\./g)) {
        res.status(403).send({ error: "Think you are funny?" });
        return;
    }
    const tool = tools.find(tut => {
        return tut.fileName.match(req.params.tutname);
    });
    if (tool) {
        res.render("tools/" + tool.fileName, { title: tool.name, description: tool.description, image: tool.imageSrc });
    } else {
        res.status(404).send({ error: "Not found." });
    }
});

module.exports = router;