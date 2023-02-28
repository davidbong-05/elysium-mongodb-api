const { Router } = require("express");
const User = require("../../models/User");

const router = Router();

router.get("/", async (req, res) => {
	try {
		const users = await User.find();
		if (!users) throw new Error("No User List found");
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/:address", async (req, res) => {
	try {
		const user = await User.findOne({ address: req.params.address });
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(200).json("User not found");
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post("/", async (req, res) => {
	const newUser = new User(req.body);
	try {
		await newUser.save();
		res.status(200).json("Registration successful");
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put("/", async (req, res) => {
	const newUserDetail = req.body;

	try {
		const user = await User.findOne({ address: newUserDetail.address });
		if (user) {
			user.username = newUserDetail.username;
			user.email = newUserDetail.email;
			try {
				await user.save();
				res.status(200).json("Update successful");
			} catch (error) {
				res.status(500).json({ message: error.message });
			}
		} else {
			res.status(200).json("User not found");
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.delete("/", async (req, res) => {
	const target_address = req.body.address;
	try {
		const removed = await User.findOneAndDelete({
			address: target_address,
		});
		if (!removed) throw Error("Something went wrong!");
		res.status(200).json(removed);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
