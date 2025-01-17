const { Router } = require("express");
const NFTCollection = require("../../models/NFTCollection");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const NFTCollections = await NFTCollection.find();
    if (!NFTCollections) throw new Error("No NFT Collections List found");
    res.status(200).json(NFTCollections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const NFTCollections = await NFTCollection.find();
    const allAddress = NFTCollections.flatMap((item) =>
      item.address.map((itemAddress) => itemAddress)
    );
    const address = {};
    for (const item of allAddress) {
      address[item] = (address[item] || 0) + 1;
    }
    const sortedAddress = Object.entries(address).sort((a, b) => b[1] - a[1]);
    res.status(200).json(sortedAddress);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/top", async (req, res) => {
  try {
    const NFTCollections = await NFTCollection.find();
    const allAddress = NFTCollections.flatMap((item) =>
      item.address.map((itemAddress) => itemAddress)
    );
    const address = {};
    for (const item of allAddress) {
      address[item] = (address[item] || 0) + 1;
    }
    const sortedAddress = Object.entries(address).sort((a, b) => b[1] - a[1]);
    const topCollection = sortedAddress.slice(0, 6); //only take 6
    res.status(200).json(topCollection);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/:address", async (req, res) => {
  try {
    const nftCollection = await NFTCollection.findOne({
      user_address: { $regex: req.params.address, $options: "i" },
    });
    if (nftCollection) {
      res.status(200).json(nftCollection.address);
    } else {
      res.status(404).json("NFT Collection not found... ...");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const nftCollection = new NFTCollection(req.body);
  try {
    await nftCollection.save();
    res.status(200).json("NFT Collection created");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/link", async (req, res) => {
  try {
    const newCollection = req.body;
    let linkedCollections = await NFTCollection.findOne({
      user_address: { $regex: newCollection.user_address, $options: "i" },
    });
    if (!linkedCollections) {
      linkedCollections = new NFTCollection({
        user_address: newCollection.user_address,
        address: [newCollection.collection_address],
      });
    } else if (
      linkedCollections.address.includes(newCollection.collection_address)
    ) {
      return res
        .status(301)
        .json(
          `${newCollection.collection_address} is already linked previously!`
        );
    } else {
      linkedCollections.address.push(newCollection.collection_address);
    }
    await linkedCollections.save();
    res.status(200).json(linkedCollections.address);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/unlink", async (req, res) => {
  try {
    const newCollection = req.body;
    let linkedCollections = await NFTCollection.findOne({
      user_address: { $regex: newCollection.user_address, $options: "i" },
    });
    if (
      !linkedCollections ||
      !linkedCollections.address.includes(newCollection.collection_address)
    ) {
      return res
        .status(301)
        .json(`${newCollection.collection_address} is not linked previously!`);
    } else {
      linkedCollections.address = linkedCollections.address.filter(
        (address) => address !== newCollection.collection_address
      );
    }
    await linkedCollections.save();
    res.status(200).json(linkedCollections.address);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/", async (req, res) => {
  const newCollectionDetail = req.body;

  try {
    const nftCollection = await NFTCollection.findOne({
      user_address: { $regex: newCollectionDetail.user_address, $options: "i" },
    });
    if (nftCollection) {
      nftCollection.address = newCollectionDetail.nft_collection;
      try {
        await nftCollection.save();
        res.status(200).json("Update successful");
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    } else {
      res.status(200).json("404");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/", async (req, res) => {
  const target = new NFTCollection(req.body);
  console.log("req", req);
  console.log("target", target);
  try {
    const removed = await NFTCollection.findOneAndDelete({
      user_address: { $regex: target.user_address, $options: "i" },
    });
    if (!removed) throw Error("Something went wrong!");
    res.status(200).json(removed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
