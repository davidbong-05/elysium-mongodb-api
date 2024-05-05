const { Schema, model } = require("mongoose");

const schema = new Schema(
	{
		user_address: {
			type: String,
			required: true,
		},
        reference: {
			type: String,
			required: true,
		},
        session_id: {
			type: String,
			required: true,
		},
	},
	{
		collection: "UserStatusLogs",
		timestamps: true
	},
);

const UserStatusLog = model("UserStatusLog", schema);

module.exports = UserStatusLog;
