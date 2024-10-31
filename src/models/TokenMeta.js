const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    hash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageHash: {
      type: String,
      required: true,
    },
  },
  {
    collection: "TokenMetas",
    timestamps: true,
  }
);

const TokenMeta = model("TokenMeta", schema);

module.exports = TokenMeta;
