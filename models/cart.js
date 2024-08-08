const fs = require("fs");
const path = require("path");

const p = path.join(process.cwd(), "data", "cart.json");

class Cart {
  static addProduct(id, price, cb) {
    fs.readFile(p, (err, cartData) => {
      let cart = { products: [], totalPrice: 0 };

      if (!err) {
        cart = JSON.parse(cartData);
      }

      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.prodId === id
      );
      const existingProduct = cart.products[existingProductIndex];
      if (existingProduct) {
        existingProduct.qty += 1;
        cart.products[existingProductIndex] = existingProduct;
      } else {
        cart.products = [...cart.products, { prodId: id, qty: 1 }];
      }

      cart.totalPrice += Number((+price).toFixed(2));

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          console.log("Error writing cart data: ", cart);
        } else {
          cb(cart);
        }
      });
    });
  }
}

module.exports = Cart;
