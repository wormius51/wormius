const router = require('express').Router();
const https = require('https');

const apiKey = "a18df946-621d-4be2-9109-615783e9aca0";

router.use("/getUser", (req, res) => {
    try {
        https.get("https://api.kongregate.com/api/authenticate.json?user_id=" + req.headers.userid +
            "&game_auth_token=" + req.headers.gameauthtoken + "&api_key=" + apiKey,
            response => {
                response.on('data', data => {
                    res.send(data);
                });
            });
    } catch (e) {
        res.send(e);
    }
});

module.exports = router;