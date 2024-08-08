const fs = require("fs");
const path = require("path");

const p = path.join(process.cwd(), "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(p, "utf-8", (err, data) => {
    if (err) {
      return cb([]);
    }
    return cb(JSON.parse(data));
  });
};

class Product {
  constructor(title, price, imageUrl, description) {
    this.id = Math.floor(Math.random() * 10000).toString();
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) {
          console.log("Error writing product data: ", err);
          return;
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      cb(product);
    });
  }
}

module.exports = Product;
