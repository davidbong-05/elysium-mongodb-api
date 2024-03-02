const { Schema } = require("mongoose");

const MetaSchema = new Schema(
	{
		created_at: {
			type: Date,
			required: true,
		},
		updated_at: {
			type: Date,
			required: false,
		},
		deleted_at: {
			type: Date,
			required: false,
		},
		verified_at: {
			type: Date,
			required: false,
		},
		banned_at: {
			type: Date,
			required: false,
		}
	},
	{
		collection: "metas",
	},
	{ timestamps: true }
);

module.exports = MetaSchema;
