const router = require('express').Router();
const post = require('../../scripts/blog/blog-post');

router.get('/editor', (req, res) => {
    res.render('worm/post-editor', {title: "Post Editor", postId: req.query.id});
});

router.put('/create', (req, res) => {
    post.create(req.body).then(data => {
        res.redirect(`./editor/${data.id}`);
    }).catch (err => {
        res.send(err);
    });
});

router.put('/update', (req, res) => {
    post.update(req.body).then(() => {
        res.status(200).send("post updated");
    }).catch (err => {
        res.status(500).send(err);
    });
});

router.delete('/delete', (req, res) => {
    post.delete(req.body.id).then(() => {
        res.status(200).send("post deleted");
    }).catch (err => {
        res.status(500).send(err);
    });
});

module.exports = router;