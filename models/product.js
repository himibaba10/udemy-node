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
}

module.exports = Product;
