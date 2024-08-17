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
    console.log(db);
    return db.collection("products").insertOne(this);
  }
}

module.exports = Product;
