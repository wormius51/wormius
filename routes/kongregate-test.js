const router = require('express').Router();
const https = require('https');

const apiKey = "a18df946-621d-4be2-9109-615783e9aca0";

router.post("/authenticate", (req, res) => {
    try {
        https.get("https://api.kongregate.com/api/authenticate.json?user_id=" + req.headers.userid +
            "&game_auth_token=" + req.headers.gameauthtoken + "&api_key=" + apiKey,
            response => {
                response.on('data', data => {
                    if (data['user_id']) {
                        req.session.userid = data['user_id'];
                        req.session.username = data.username;
                    } else {
                        req.session.userid = 0;
                        req.session.username = "guest";
                    }
                    res.send({userid: req.session.userid, username: req.session.username, sessionId: req.sessionID});
                });
            });
    } catch (e) {
        res.send(e);
    }
});

router.get("/getUser", (req,res) => {
    res.send({userid: req.session.userid, username: req.session.username, sessionId: req.sessionID});
});

module.exports = router;