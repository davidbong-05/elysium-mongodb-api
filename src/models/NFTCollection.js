const { Schema, model } = require("mongoose");
const MetaSchema = require("./Meta");

const NFTCollectionSchema = new Schema(
	{
		user_address: {
			type: String,
			required: true,
		},
		address: {
			type: [String], //Array of nft collection address
		},
		meta:{
			type: MetaSchema,
		}
	},
	{
		collection: "NFTCollections",
		timestamps: true 
	},
);

const NFTCollection = model("Collections", NFTCollectionSchema);

module.exports = NFTCollection;
