const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/database");

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDB();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    let cart = this.cart;

    if (!cart) {
      cart = { items: [] };
    }

    const cartProductIndex = cart.items.findIndex((cartItem) => {
      return cartItem.productId.toString() === product._id.toString();
    });

    let updatedCartProducts = [...cart?.items];
    let newQuantity = 1;

    if (cartProductIndex >= 0) {
      updatedCartProducts[cartProductIndex].quantity += newQuantity;
    } else {
      updatedCartProducts.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = { items: updatedCartProducts };

    const db = getDB();
    return db.collection("users").updateOne(
      { _id: new ObjectId(this._id) },
      {
        $set: {
          cart: updatedCart,
        },
      }
    );
  }

  getCart() {
    const db = getDB();
    const cartItems = this.cart.items;

    const productIds = cartItems.map((cartItem) => cartItem.productId);

    return db
      .collection("products")
      .find({
        _id: {
          $in: productIds,
        },
      })
      .toArray()
      .then((products) => {
        const productsWithQuantity = products.map((product) => {
          const quantity = cartItems.find(
            (cartItem) =>
              cartItem.productId.toString() === product._id.toString()
          ).quantity;
          return { ...product, quantity };
        });

        return productsWithQuantity;
      });
  }

  static findById(userId) {
    const db = getDB();
    return db.collection("users").findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;
