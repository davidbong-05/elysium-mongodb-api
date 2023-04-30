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

router.get("/topCollection", async (req, res) => {
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
			user_address: req.params.address,
		});
		if (nftCollection) {
			res.status(200).json(nftCollection.address);
		} else {
			res.status(200).json("404");
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

router.put("/", async (req, res) => {
	const newCollectionDetail = req.body;

	try {
		const nftCollection = await NFTCollection.findOne({
			user_address: newCollectionDetail.user_address,
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
			user_address: target.user_address,
		});
		if (!removed) throw Error("Something went wrong!");
		res.status(200).json(removed);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
