const router = require("express").Router();

router.get("/", (req, res, next) => {
    res.render("website-links", {
        description: "Links to websites I find neat. Those are not made by me, I just think they are cool.",
        title: "Links",
        websiteLinks: [
            WebsiteLink(
                "Brainerly", "https://brainerly.com", "images/websiteLinks/brainerly.png",
                "A website that showcases and talks about puzzle games."
            )
        ]
    })
});

function WebsiteLink(name, url, imageSrc, description) {
    let websiteLink = {
        name: name,
        url: url,
        imageSrc: imageSrc,
        description: description
    };
    return websiteLink;
}


module.exports = router;