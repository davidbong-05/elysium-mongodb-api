const { Schema, model } = require("mongoose");

const CartSchema = new Schema(
	{
		user_address: {
			type: String,
			required: true,
		},
		cart_content: {
			type: [Object], //list of NFTs
		},
	},
	{
		collection: "carts",
	},
	{ timestamps: true }
);

const Cart = model("cart", CartSchema);

module.exports = Cart;
