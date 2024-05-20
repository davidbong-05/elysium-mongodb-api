const { Router } = require("express");
const User = require("../../models/User");
const Auth = require("../../models/Auth");
const UserStatusLog = require("../../models/UserStatusLog");
const bodyParser = require('body-parser');
const GenerateVerificationEmail = require("../../emails/GenerateVerificationEmail");
const sgMail = require('@sendgrid/mail')
const moment = require('moment');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const router = new Router();
router.use(bodyParser.json());

const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

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
            userStatus.reference = "logged_out";
			await userStatus.save();
            res.status(200).send('Logout successfully');
		} else {
			res.status(404).json("Logout failed");
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post("/ping", async (req, res) => {
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
            res.status(200).send('Ping successfully');
		} else {
			res.status(404).json("Ping failed");
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post('/send-verification-email', async (req, res) => {
	try{
		const { email } = req.body;
		const user = await User.findOne({
			email: { $regex: email, $options: "i" },
		});
		if (user === null){
			return res.status(404).send('User not found');
		}

		if (user.verifiedAt != null){
			return res.status(400).send('User already verified');
		}

		var auth = await Auth.findOne({
			email: { $regex: email, $options: "i" },
		});

		var token = null;
		if (!auth) {
			const expiredAt = moment().add(1, 'hour');
			token = generateRandomString(25);
			auth = {
				username: user.username,
				address: user.address,
				email: user.email,
				token: token,
				expiredAt: expiredAt
			};
			const newAuth = new Auth(auth);
			newAuth.save();
		}
		else if (auth.expiredAt && moment().isAfter(auth.expiredAt)) {
			token = generateRandomString(15);
			auth.token = token;
			auth.save();
		}
		else {
			return res.status(400).send('An email has been sent previously, please check your inbox or try again after ' + auth.expiredAt);
		}

		const link = 'https://elysium-nft-marketplace.netlify.app/verify?token=';
		const msg = {
			to,
			from: 'elysium.custodian@gmail.com', // Use the email address you verified with SendGrid
			subject: 'Verify your email',
			html: GenerateVerificationEmail(user.username, link, token)
		};
		sgMail
			.send(msg)
			.then(() => {
				res.status(200).send('Email sent successfully');
			})
			.catch(error => {
				res.status(500).send('Failed to send email');
			});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post('/verify', async (req, res) => {
	try{
		const { address, token } = req.body;
		const user = await User.findOne({
			address: { $regex: address, $options: "i" },
		});
		if (user === null){
			return res.status(404).send('User not found');
		}

		if (user.verifiedAt != null){
			return res.status(400).send('User already verified');
		}

		var auth = await Auth.findOne({
			address: { $regex: address, $options: "i" },
		});

		if (auth && token === auth.token && address === auth.address) {
			user.verifiedAt = moment();
			user.save();
			auth.remove();
			return res.status(200).send('Verified');
		}
		else if (auth && auth.expiredAt && moment().isAfter(auth.expiredAt)) {
			return res.status(400).send('Verification failed: token expired. Please try again...');
		}
		else {
			return res.status(400).send('Verification failed. Please try again...');
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
module.exports = router;