const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			index: {
				unique: true,
			},
		},
		address: {
			type: String,
			required: true,
			index: {
				unique: true,
			},
		},
		email: {
			type: String,
			required: false,
			index: {
				unique: true,
			},
		},
		profile_url: {
			type: String,
			required: false,
		},
		background_url: {
			type: String,
			required: false,
		},
		description: {
			type: String,
			required: false,
		},
		verified_at: {
			type: Date,
			required: false,
		},
		following: {
			type: [String], //Array of addresses
			required: false,
		},
		cart_content: {
			type: [Object], //list of NFTs
			required: false,
		},
	},
	{
		collection: "users",
	},
	{ timestamps: true }
);

const User = model("user", UserSchema);

module.exports = User;
