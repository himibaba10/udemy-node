const Order = require("../models/order");
const Product = require("../models/product");
const fs = require("fs");
const path = require("path");

const getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getProduct = (req, res, next) => {
  Product.findById(req.params.productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product,
        pageTitle: "Product Detail",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getIndex = (req, res, next) => {
  Product.find()
    .lean() // This returns plain JavaScript objects
    .then((products) => {
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
  req.user
    .getCart()
    .then((user) => {
      const products = user.cart.items.map((product) => ({
        _id: product.productId._id,
        title: product.productId.title,
        quantity: product.quantity,
      }));
      res.render("shop/cart", {
        products: products,
        pageTitle: "Cart",
        path: "/cart",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const postCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteCart = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .deleteCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

const postOrder = (req, res, next) => {
  req.user
    .getCart()
    .then((user) => {
      const products = user.cart.items.map((product) => ({
        productData: {
          _id: product.productId._id,
          title: product.productId.title,
          price: product.productId.price,
        },
        quantity: product.quantity,
      }));

      return products;
    })
    .then((products) => {
      return Order.create({
        products,
        user: {
          email: req.session.user.email,
          userId: req.session.user._id,
        },
      });
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

const getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user._id })
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// const getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     pageTitle: "Checkout",
//     path: "/checkout",
//   });
// };

const getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join("data", "invoices", invoiceName);

  //Just to check whether the invoice belongs to the authorized user
  Order.findById(orderId).then((order) => {
    if (!order) {
      return next(new Error("Order not found."));
    }

    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error("Unauthorized access."));
    }

    fs.readFile(invoicePath, (err, data) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      //setting header so we know it is a pdf and can be downloaded as pdf
      res.setHeader("Content-Type", "application/pdf");

      //attachment means download, inline means open the file in the browser
      res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

      res.send(data);
    });
  });
};

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  deleteCart,
  postOrder,
  getOrders,
  // getCheckout,
  getInvoice,
};
