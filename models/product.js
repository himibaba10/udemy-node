const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Product = model("Product", ProductSchema);

module.exports = Product;
