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

router.get("/top", async (req, res) => {
  try {
    const users = await User.find({ followers_count: { $gt: 0 } })
      .sort({ followers_count: -1 }) // Sort by followers_count in descending order
      .limit(6); //only take 6
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/name/all", async (req, res) => {
  try {
    const users = await User.find(); // Use find() to get all users
    if (users.length > 0) {
      res.status(200).json(
        users.map((user) => ({
          address: user.address,
          username: user.username,
        }))
      );
    } else {
      res.status(200).json("No registered addresses found.");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/name/:address", async (req, res) => {
  try {
    const user = await User.findOne({
      address: { $regex: req.params.address, $options: "i" },
    });
    if (user) {
      res.status(200).json(user.username);
    } else {
      res.status(200).json("address not registered");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  try {
    const newUser = new User(req.body);
    const existingUser = await User.findOne({
      email: { $regex: newUser.email, $options: "i" },
    });
    if (existingUser) {
      res.status(400).json({
        message:
          "Email has been taken by " +
          existingUser.address +
          ". Please report to the admin if it is not you.",
      });
    }
    // var regExp = new RegExp(
    //   /^[^\s@]+@(siswa\.unimas\.my)|(davidbong05@gmail\.com)$/
    // );
    var regExp = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    if (!regExp.test(newUser.email)) {
      res.status(400).json({ message: "Invalid email" });
    } else {
      try {
        newUser.role = "unverified-user";
        await newUser.save();
        res.status(200).json("Registration successful");
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const target_address = req.body.target_address;
    const user = await User.findOne({
      address: { $regex: req.body.user_address, $options: "i" },
    });

    const target_user = await User.findOne({
      address: { $regex: target_address, $options: "i" },
    });

    if (user) {
      if (user.following.includes(target_address)) {
        return res.status(400).json("Already following " + target_address);
      }
      try {
        user.following.push(target_address);
        await user.save();
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    } else {
      res.status(404).json("User not found");
    }

    if (target_user) {
      target_user.followers_count += 1;
      try {
        await target_user.save();
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }

    res.status(200).json("Update successful");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/unfollow", async (req, res) => {
  try {
    const target_address = req.body.target_address;

    const user = await User.findOne({
      address: { $regex: req.body.user_address, $options: "i" },
    });
    const target_user = await User.findOne({
      address: { $regex: target_address, $options: "i" },
    });
    if (user) {
      if (!user.following.includes(target_address)) {
        return res.status(400).json("Not following " + target_address);
      }

      const index = user.following.indexOf(target_address.toLowerCase());
      if (index !== -1) {
        user.following.splice(index, 1);
      }
      try {
        await user.save();
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    } else {
      res.status(404).json("User not found");
    }
    if (target_user) {
      target_user.followers_count -= 1;
      try {
        await target_user.save();
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
    res.status(200).json("Update successful");
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
