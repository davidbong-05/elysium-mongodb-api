const { Schema, model } = require("mongoose");

const AuthSchema = new Schema(
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
			required: true,
			index: {
				unique: true,
			},
		},
		token: {
			type: String,
			required: true,
			required: false,
		},
		expiredAt: {
			type: String,
			required: false,
		}
	},
	{
		collection: "Auths",
		timestamps: true
	},
);

const Auth = model("Auth", AuthSchema);

module.exports = Auth;
