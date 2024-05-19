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
		role: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
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
		following: {
			type: [String], //Array of addresses
			required: false,
		},
		followers_count:{
			type: Number,
			required: false
		},
		cart_content: {
			type: [Object], //list of NFTs
			required: false,
		},
		session_id: {
			type: String,
			required: false,
		},
		verifiedAt: {
			type: Date,
			required: false,
		}
	},
	{
		collection: "Users",
		timestamps: true
	},
);

const User = model("User", UserSchema);

module.exports = User;
