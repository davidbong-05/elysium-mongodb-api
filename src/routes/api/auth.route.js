const { Router } = require("express");
const User = require("../../models/User");
const UserStatusLog = require("../../models/UserStatusLog");

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

router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({
			address: {
				$regex: req.body.user_address,
				$options: "i",
			},
		});
		if (user) {
            const newStatus = new UserStatusLog(req.body);
            newStatus.session_id = Math.random().toString(36).slice(2);
            newStatus.reference = newStatus.session_id 
			await newStatus.save();
            user.session_id = newStatus.session_id;
			res.status(200).json(user);
		} else {
			res.status(404).json("User not found");
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post("/logout", async (req, res) => {
	try {
        const userStatus = await UserStatusLog.findOne({
			address: {
				$regex: req.body.user_address,
				$options: "i",
			},
            session_id : req.body.session_id,
		});
		if (userStatus) {
            userStatus.reference = Math.random().toString(36).slice(2);
			await userStatus.save();
            res.status(200).send('Logout successfully');
		} else {
			res.status(404).json("Logout failed");
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;