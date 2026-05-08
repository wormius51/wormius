const { MailtrapClient } = require('mailtrap');
const emailValidator = require('node-email-verifier');

const router = require('express').Router();

router.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ status: 'error', message: 'Missing required fields!' })
    }
    const isEmailValid = await emailValidator(email);
    if (!isEmailValid) {
        return res.status(400).json({
            status: 'error',
            message: 'Email is not valid. Please try again!'
        });
    }


    try {
        await sendEmailToMe(name, email, subject, message);
    } catch (exception) {
        console.error(exception);
        return res.status(500).json({ status: 'error', message: "There was an error while sending the email" });
    }


    // Placeholder response for a successful email submission
    res.redirect("/email-received");
});

async function sendEmailToMe(name, email, subject, message) {
    const TOKEN = process.env.MAILTRAP_API_TOKEN;

    const client = new MailtrapClient({
        token: TOKEN,
    });

    const sender = {
        email: process.env.SENDING_EMAIL,
        name: "Wormius",
    };
    const recipients = [
        {
            email: process.env.MY_EMAIL,
        }
    ];

    const text =
    `
Customer name: ${name}
Customer email: ${email}
Subject: ${subject}

${message}
    `;

    return client.send({
        from: sender,
        to: recipients,
        subject: subject,
        text: text,
        category: "Contact"
    });
}

module.exports = router;


function sendTestEmail() {
    const TOKEN = process.env.MAILTRAP_API_TOKEN;

    const client = new MailtrapClient({
        token: TOKEN,
    });

    const sender = {
        email: process.env.SENDING_EMAIL,
        name: "Wormius",
    };
    const recipients = [
        {
            email: process.env.MY_EMAIL,
        }
    ];

    client
        .send({
            from: sender,
            to: recipients,
            subject: "Testing the email",
            text: "Congrats for sending test email with Mailtrap!",
            category: "Integration Test",
        })
        .then(console.log, console.error);
}





