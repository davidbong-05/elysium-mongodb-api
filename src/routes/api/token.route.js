const { Router } = require("express");
const TokenMeta = require("../../models/TokenMeta");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tokenMetas = await TokenMeta.find();
    if (!tokenMetas) throw new Error("No token meta found.");
    return res.status(200).json(tokenMetas);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/meta/all", async (req, res) => {
  try {
    const tokenMetas = await TokenMeta.find();
    if (tokenMetas.length > 0) {
      return res.status(200).json(tokenMetas);
    } else {
      return res.status(404).json("No token meta found.");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/meta/:hash", async (req, res) => {
  try {
    const tokenMeta = await TokenMeta.findOne({
      hash: { $regex: req.params.hash, $options: "i" },
    });
    if (tokenMeta) {
      return res.status(200).json(tokenMeta.username);
    } else {
      return res.status(404).json("Token meta hash does not exist.");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/meta", async (req, res) => {
  try {
    const newTokenMeta = new TokenMeta(req.body);
    const existingTokenMeta = await TokenMeta.findOne({
      hash: { $regex: newTokenMeta.hash, $options: "i" },
    });
    if (existingTokenMeta) {
      return res.status(201).json(existingTokenMeta);
    }
    await newTokenMeta.save();
    return res.status(200).json(newTokenMeta);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/", async (req, res) => {
  const target_hash = req.body.hash;
  try {
    const removed = await TokenMeta.findOneAndDelete({
      hash: target_hash,
    });
    if (!removed) throw Error("Something went wrong!");
    return res.status(200).json(removed);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
module.exports = router;
