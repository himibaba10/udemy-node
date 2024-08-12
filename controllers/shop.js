const Cart = require("../models/cart");
const Product = require("../models/product");

const getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getProduct = (req, res, next) => {
  Product.findById(req.params.productId)
    .then(([product]) => {
      res.render("shop/product-detail", {
        product: product[0],
        pageTitle: "Product Detail",
        path: "/products",
      });
    })
    .catch();
};

const getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getCart = (req, res, next) => {
  const cartProducts = [];
  Cart.getProducts((cart) => {
    Product.fetchAll((products) => {
      for (const product of products) {
        const cartProduct = cart.products.find(
          (prod) => prod.prodId === product.id
        );
        if (cartProduct) {
          cartProducts.push({ ...product, qty: cartProduct.qty });
        }
      }

      res.render("shop/cart", {
        products: cartProducts,
        pageTitle: "Cart",
        path: "/cart",
      });
    });
  });
};

const postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price, (cart) => {
      res.redirect("/cart");
    });
  });
};

const deleteCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price, () => {
      res.redirect("/cart");
    });
  });
};

const getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};

const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  deleteCart,
  getOrders,
  getCheckout,
};
