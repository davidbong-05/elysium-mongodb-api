const { Router } = require("express");
const User = require("../../models/User");
const bodyParser = require('body-parser');

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const router = new Router();
router.use(bodyParser.json());

// Route to send email
router.post('/send-email', (req, res) => {
    const { to, subject, text } = req.body;
    const msg = {
        to,
        from: 'elysium.custodian@gmail.com', // Use the email address you verified with SendGrid
        subject,
        text
    };

    sgMail
        .send(msg)
        .then(() => {
            res.status(200).send('Email sent successfully');
        })
        .catch(error => {
            res.status(500).send('Failed to send email');
        });
});

module.exports = router;