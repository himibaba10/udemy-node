const Cart = require("./cart");
const db = require("../utils/database");
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

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }

  static update(productData, cb) {
    getProductsFromFile((products) => {
      const updatedProductIndex = products.findIndex(
        (prod) => prod.id === productData.id
      );
      const updatedProducts = [...products];
      updatedProducts[updatedProductIndex] = productData;
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (err) {
          console.log("Error writing product data: ", err);
          return;
        } else {
          cb();
        }
      });
    });
  }

  static delete(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProducts = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (err) {
          console.log("Error deleting product data: ", err);
          return;
        } else {
          Cart.deleteProduct(product.id, product.price, () => {
            cb();
          });
        }
      });
    });
  }
}

module.exports = Product;
