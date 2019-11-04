const router = require('express').Router();
const http = require('http');

const apiKey = "a18df946-621d-4be2-9109-615783e9aca0";

router.use("/getUser", (req, res) => {
    res.send(req.query);
    return;
    try {
        http.get("http://www.kongregate.com/api/authenticate.json?user_id=" + req.body.userId +
            "&game_auth_token=" + req.body.gameAuthToken + "&api_key=" + apiKey,
            response => {
                res.send(response);
            });
    } catch (e) {
        res.send(e);
    }
});

module.exports = router;