const { Router } = require("express");
const Cart = require("../../models/Cart");

const router = Router();

router.get("/", async (req, res) => {
	try {
		const carts = await Cart.find();
		if (!carts) throw new Error("No Cart List found");
		res.status(200).json(carts);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post("/check", async (req, res) => {
	try {
		const cart = await Cart.findOne({ user_address: req.body.user_address });
		if (cart) {
			res.status(200).json(cart);
		} else {
			res.status(200).json("Cart not found");
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post("/", async (req, res) => {
	const newCart = new Cart(req.body);
	try {
		await newCart.save();
		res.status(200).json("Cart created");
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.put("/", async (req, res) => {
	const newCartDetail = req.body;
	try {
		const cart = await Cart.findOne({
			user_address: newCartDetail.user_address,
		});
		if (cart) {
			cart.cart_content = newCartDetail.cart_content;
			try {
				await cart.save();
				res.status(200).json("Update successful");
			} catch (error) {
				res.status(500).json({ message: error.message });
			}
		} else {
			res.status(200).json("Cart not found");
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.delete("/", async (req, res) => {
	const target_address = req.body.address;
	try {
		const removed = await Cart.findOneAndDelete({
			user_address: target_address,
		});
		if (!removed) throw Error("Something went wrong!");
		res.status(200).json(removed);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
