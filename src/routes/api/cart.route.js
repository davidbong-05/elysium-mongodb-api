const { Router } = require("express");
const User = require("../../models/User");

const router = Router();

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({
      address: { $regex: req.body.user_address, $options: "i" },
    });
    res.status(200).json(user.cart_content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/clear", async (req, res) => {
  try {
    const user = await User.findOne({
      address: { $regex: req.body.user_address, $options: "i" },
    });
    if (user) {
      user.cart_content = [];
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

router.put("/", async (req, res) => {
  const newCartDetail = req.body;
  try {
    const user = await User.findOne({
      address: { $regex: newCartDetail.user_address, $options: "i" },
    });
    if (user) {
      user.cart_content = newCartDetail.cart_content;
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

module.exports = router;
