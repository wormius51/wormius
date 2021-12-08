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
            "current_page": 1,
            "data": [
              {
                "support_id": 245731,
                "support_note": "hello take my money",
                "support_coffees": 1,
                "transaction_id": "3JV542690H0XXX",
                "support_visibility": 1,
                "support_created_on": "2020-08-05 09:38:26",
                "support_updated_on": "2020-08-05 09:38:26",
                "transfer_id": null,
                "supporter_name": "yey",
                "support_coffee_price": "1.0000",
                "support_email": "****@gmail.com",
                "is_refunded": null,
                "support_currency": "GBP",
                "support_note_pinned": 0,
                "referer": null,
                "country": "IN",
                "payer_email": "*****@gmail.com",
                "payment_platform": "paypal",
                "payer_name": "** Fora"
              },
              {
                "support_id": 245730,
                "support_note": null,
                "support_coffees": 1,
                "transaction_id": "7S721018AR89XXXX",
                "support_visibility": 1,
                "support_created_on": "2020-08-05 09:34:43",
                "support_updated_on": "2020-08-05 09:34:43",
                "transfer_id": null,
                "supporter_name": null,
                "support_coffee_price": "3.0000",
                "support_email": "*****@gmail.com",
                "is_refunded": null,
                "support_currency": "GBP",
                "support_note_pinned": 0,
                "referer": null,
                "country": "IN",
                "payer_email": "*****@gmail.com",
                "payment_platform": "paypal",
                "payer_name": "Quip Fora"
              },
              {
                "support_id": 243815,
                "support_note": "; drop all tables",
                "support_coffees": 1,
                "transaction_id": "7A1953730C******",
                "support_visibility": 1,
                "support_created_on": "2020-08-03 10:50:58",
                "support_updated_on": "2020-08-03 10:50:58",
                "transfer_id": null,
                "supporter_name": "<script>alert('boo')</script>",
                "support_coffee_price": "3.0000",
                "support_email": "**@****.com",
                "is_refunded": null,
                "support_currency": "GBP",
                "support_note_pinned": 0,
                "referer": null,
                "country": null,
                "payer_email": "***@***.com",
                "payment_platform": "paypal",
                "payer_name": "asdas"
              },
              {
                "support_id": 233527,
                "support_note": null,
                "support_coffees": 1,
                "transaction_id": "60E21623W*****",
                "support_visibility": 1,
                "support_created_on": "2020-07-23 04:12:28",
                "support_updated_on": "2020-07-23 04:12:28",
                "transfer_id": null,
                "supporter_name": null,
                "support_coffee_price": "3.0000",
                "support_email": "****@buymeacoffee.com",
                "is_refunded": null,
                "support_currency": "GBP",
                "support_note_pinned": 0,
                "referer": null,
                "country": null,
                "payer_email": "*****@buymeacoffee.com",
                "payment_platform": "paypal",
                "payer_name": ""
              },
              {
                "support_id": 232695,
                "support_note": null,
                "support_coffees": 1,
                "transaction_id": "1GW08219017XXXX",
                "support_visibility": 1,
                "support_created_on": "2020-07-22 04:13:49",
                "support_updated_on": "2020-07-22 04:13:49",
                "transfer_id": null,
                "supporter_name": null,
                "support_coffee_price": "3.0000",
                "support_email": "****@brew.com",
                "is_refunded": null,
                "support_currency": "GBP",
                "support_note_pinned": 0,
                "referer": null,
                "country": null,
                "payer_email": "***@brew.com",
                "payment_platform": "paypal",
                "payer_name": "jijo sunny"
              }
            ],
            "first_page_url": "https://developers.buymeacoffee.com/api/v1/supporters?page=1",
            "from": 1,
            "last_page": 2,
            "last_page_url": "https://developers.buymeacoffee.com/api/v1/supporters?page=2",
            "next_page_url": "https://developers.buymeacoffee.com/api/v1/supporters?page=2",
            "path": "https://developers.buymeacoffee.com/api/v1/supporters",
            "per_page": 5,
            "prev_page_url": null,
            "to": 5,
            "total": 10
          }`);
    }
});

module.exports = router;