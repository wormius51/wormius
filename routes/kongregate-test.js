const router = require('express').Router();
const https = require('https');

const apiKey = "a18df946-621d-4be2-9109-615783e9aca0";

router.use("/getUser", (req, res) => {
    try {
        console.log(req.headers.userid);
        console.log(req.headers.gameauthtoken);
        https.get("https://api.kongregate.com/api/authenticate.json?user_id=" + req.headers.userid +
            "&game_auth_token=" + req.headers.gameauthtoken + "&api_key=" + apiKey,
            response => {
                console.log(response);
                res.send(response);
            });
    } catch (e) {
        res.send(e);
    }
});

module.exports = router;