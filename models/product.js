const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/database");

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {
    const db = getDB();
    return db.collection("products").insertOne(this);
  }

  static findAll(cb) {
    const db = getDB();
    return db.collection("products").find({}).toArray();
  }

  static findById(id) {
    const db = getDB();
    return db.collection("products").findOne({ _id: new ObjectId(id) });
  }

  static update(id, data) {
    const db = getDB();
    return db
      .collection("products")
      .updateOne({ _id: new ObjectId(id) }, { $set: data });
  }

  static delete(id) {
    const db = getDB();
    return db.collection("products").deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Product;
