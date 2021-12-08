const router = require('express').Router();
const fetch = require('node-fetch');

router.get('/supporters', async (req, res) => {
    if (process.env['bmc-token']) {
        const options = {
            method: 'get', 
            headers: {'Authorization': `Bearer ${process.env['bmc-token']}`}
        }
        const bmcRes = await fetch('https://developers.buymeacoffee.com/api/v1/supporters', options);
        const body = await bmcRes.text();
        res.send(body);
    } else { // dummy data on local
        res.send(`{
            "error": "no token" 
          }`);
    }
});

module.exports = router;