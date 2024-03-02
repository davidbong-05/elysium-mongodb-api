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

router.get("/topUser", async (req, res) => {
	try {
		const users = await User.find();
		const allAddress = users.flatMap((item) =>
			item.following.map((itemAddress) => itemAddress)
		);
		const address = {};
		for (const item of allAddress) {
			address[item] = (address[item] || 0) + 1;
		}
		const sortedAddress = Object.entries(address).sort((a, b) => b[1] - a[1]);
		const topUser = sortedAddress.slice(0, 6); //only take 6
		res.status(200).json(topUser);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error");
	}
});

router.get("/:address", async (req, res) => {
	try {
		const user = await User.findOne({
			address: { $regex: req.params.address, $options: "i" },
		});
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).json("User not found");
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/:address/following", async (req, res) => {
	try {
		const user = await User.findOne({
			address: { $regex: req.params.address, $options: "i" },
		});
		if (user) {
			res.status(200).json(user.following);
		} else {
			res.status(404).json("User not found");
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post("/", async (req, res) => {
	const newUser = new User(req.body);
	var regExp = new RegExp(/^[^\s@]+@(siswa\.unimas\.my)|(davidbong05@gmail\.com)$/);
	if(!regExp.test(newUser.email)) {
		res.status(400).json({message: "Invalid email"});
	}
	else{
		try {
			await newUser.save();
			res.status(200).json("Registration successful");
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}
});

router.post("/follow/check", async (req, res) => {
	try {
		const user = await User.findOne({
			address: {
				$regex: req.body.user_address,
				$options: "i",
			},
		});
		if (!user) {
			res.status(404).json("User not found");
		} else {
			res
				.status(200)
				.json(user.following.includes(req.body.target_address.toLowerCase()));
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put("/", async (req, res) => {
	const newUserDetail = req.body;

	try {
		const user = await User.findOne({
			address: { $regex: newUserDetail.address, $options: "i" },
		});
		if (user) {
			user.username = newUserDetail.username;
			user.description = newUserDetail.description;
			try {
				await user.save();
				res.status(200).json("Update successful");
			} catch (error) {
				res.status(500).json({ message: error.message });
			}
		} else {
			res.status(404).json("User not found");
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put("/profile_url", async (req, res) => {
	const newUserDetail = req.body;
	try {
		const user = await User.findOne({
			address: { $regex: newUserDetail.address, $options: "i" },
		});
		if (user) {
			user.profile_url = newUserDetail.profile_url;
			try {
				await user.save();
				res.status(200).json("Update successful");
			} catch (error) {
				res.status(500).json({ message: error.message });
			}
		} else {
			res.status(404).json("User not found");
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put("/background_url", async (req, res) => {
	const newUserDetail = req.body;
	try {
		const user = await User.findOne({
			address: { $regex: newUserDetail.address, $options: "i" },
		});
		if (user) {
			user.background_url = newUserDetail.background_url;
			try {
				await user.save();
				res.status(200).json("Update successful");
			} catch (error) {
				res.status(500).json({ message: error.message });
			}
		} else {
			res.status(404).json("User not found");
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put("/follow", async (req, res) => {
	try {
		const user = await User.findOne({
			address: { $regex: req.body.user_address, $options: "i" },
		});
		if (user) {
			user.following.push(req.body.target_address);
			try {
				await user.save();
				res.status(200).json("Update successful");
			} catch (error) {
				res.status(500).json({ message: error.message });
			}
		} else {
			res.status(404).json("User not found");
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put("/unfollow", async (req, res) => {
	try {
		const user = await User.findOne({
			address: { $regex: req.body.user_address, $options: "i" },
		});
		if (user) {
			const index = user.following.indexOf(
				req.body.target_address.toLowerCase()
			);
			if (index !== -1) {
				user.following.splice(index, 1);
			}
			try {
				await user.save();
				res.status(200).json("Update successful");
			} catch (error) {
				res.status(500).json({ message: error.message });
			}
		} else {
			res.status(404).json("User not found");
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
