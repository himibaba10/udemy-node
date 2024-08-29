const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
});

// const { ObjectId } = require("mongodb");
// const { getDB } = require("../utils/database");

// class Product {
//   constructor(title, price, imageUrl, description, userId) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDB();
//     return db.collection("products").insertOne(this);
//   }

//   static findAll(cb) {
//     const db = getDB();
//     return db.collection("products").find({}).toArray();
//   }

//   static findById(id) {
//     const db = getDB();
//     return db.collection("products").findOne({ _id: new ObjectId(id) });
//   }

//   static update(id, data) {
//     const db = getDB();
//     return db
//       .collection("products")
//       .updateOne({ _id: new ObjectId(id) }, { $set: data });
//   }

//   static delete(id) {
//     const db = getDB();
//     return db.collection("products").deleteOne({ _id: new ObjectId(id) });
//   }
// }

const Product = model("Product", ProductSchema);

module.exports = Product;
