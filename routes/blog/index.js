const router = require('express').Router();
const post = require('../../scripts/blog/blog-post');
const catchWebException = require('../../scripts/web-exception').catchWebException;

router.get('/', (req, res) => {
    post.read({status: "published"}, ["id", "title", "preview", "coverimage"], {colname: "publishdate", acsending: false}).then(data => {
        res.render('blog/overview', {title: "Blog", posts: data.rows});
    }).catch(err => {
        catchWebException(res, err);
    });
});

router.get('/post', (req, res) => {
    // On localhost try with dummy data
    if (!process.env.DATABASE_URL) {
        res.render('blog/post', 
        {title: "Dummy Post", postId: req.query.id, content: '<h1 class = "primaryText editable">Dummy</h1>'});
        return;
    }
    post.read({id: req.query.id}).then (data => {
        if (data.rowCount == 0) {
            res.sendStatus(404);
            return;
        }
        res.render('blog/post', 
        {title: data.rows[0].title, postId: req.query.id, content: data.rows[0].content});
    }).catch (err => {
        catchWebException(res, err);
    });
});

module.exports = router;