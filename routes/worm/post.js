const router = require('express').Router();
const post = require('../../scripts/blog/blog-post');

router.get('/editor', (req, res) => {
    res.render('worm/post-editor', {title: "Post Editor", postId: req.query.id});
});

router.post('/create', (req, res) => {
    post.create(req.body).then(data => {
        res.redirect(`./editor?id=${data.rows[0].id}`);
    }).catch (err => {
        res.status(500).send(err);
    });
});

router.put('/update', (req, res) => {
    post.update(req.body).then(() => {
        res.status(200).send("post updated");
    }).catch (err => {
        res.send(err).status(500);
    });
});

router.put('/publish', (req, res) => {
    post.publish(req.body.id).then(data => {
        if (data.rowCount == 0)
            res.send("didn't find a post with this id and not published").status(404);
        else
            res.send("post published").status(200);
    }).catch (err => {
        res.send(err).status(500);
    });
});

router.delete('/delete', (req, res) => {
    post.delete(req.body.id).then(() => {
        res.send("post deleted").status(200);
    }).catch (err => {
        res.send(err).status(500);
    });
});

module.exports = router;