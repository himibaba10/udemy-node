const Order = require("../models/order");
const Product = require("../models/product");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { ITEMS_PER_PAGE } = require("../constants");
const stripe = require("stripe")(
  "sk_test_51IfozGLPGv78GAwMzYzGvpCLS5VZ3zsOPfI9EdYpHpqeUMosFR1d4bVw4Vmaf1tCJ72P9TjiuBKArLI10nQuCUL200TiDf6Z5Z"
);

const getProducts = (req, res, next) => {
  const pageNumber = +req.query.page || 1;
  Product.find()
    .skip((pageNumber - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
        currentPage: pageNumber,
        itemsPerPage: ITEMS_PER_PAGE,
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
  const pageNumber = +req.query.page || 1;
  Product.find()
    .skip((pageNumber - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .lean() // This returns plain JavaScript objects
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: pageNumber,
        itemsPerPage: ITEMS_PER_PAGE,
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

const getCheckout = (req, res, next) => {
  req.user
    .getCart()
    .then((user) => {
      let totalPrice = 0;
      const products = user.cart.items.map((product) => {
        totalPrice += product.productId.price * product.quantity;
        return {
          _id: product.productId._id,
          title: product.productId.title,
          quantity: product.quantity,
        };
      });

      res.render("shop/checkout", {
        products: products,
        pageTitle: "Checkout",
        path: "/checkout",
        isAuthenticated: req.session.isLoggedIn,
      });
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

    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     console.log(err);
    //     return next(err);
    //   }

    //   //setting header so we know it is a pdf and can be downloaded as pdf
    //   res.setHeader("Content-Type", "application/pdf");

    //   //attachment means download, inline means open the file in the browser
    //   res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

    //   res.send(data);
    // });

    // Since it might be a big file, that's why we need to get it as a stream
    // const file = fs.createReadStream(invoicePath);
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);
    // file.pipe(res);

    const pdfDoc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(18).text("Invoice");

    pdfDoc.text("-----------------------");

    let totalPrice = 0;
    order.products.forEach((product) => {
      totalPrice += product.productData.price * product.quantity;
      pdfDoc
        .fontSize(14)
        .text(
          `${product.productData.title} - ${product.quantity} x $${product.productData.price}`
        );
    });
    pdfDoc.text("-----------------------");

    pdfDoc.fontSize(14).text(`Total: $${totalPrice}`);

    pdfDoc.end();
  });
};

const createCheckoutSession = (req, res, next) => {
  // let productData = [];
  req.user
    .getCart()
    .then((user) => {
      return user.cart.items.map((product) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.productId.title,
            description: product.productId.description,
          },
          unit_amount: product.productId.price * 100,
        },
        quantity: product.quantity,
      }));
    })
    .then((productData) => {
      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: productData,
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/checkout/success`,
        cancel_url: `${req.protocol}://${req.get("host")}/checkout/cancel`,
      });
    })
    .then((session) => {
      req.user.clearCart().then(() => {
        res.redirect(303, session.url);
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getSuccess = (req, res, next) => {
  res.send(`
    <h1>You have successfully completed the purchase!</h1>
    `);
};

const getCancel = (req, res, next) => {
  res.send(`
    <h1>You canceled the order!</h1>
    `);
};

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  deleteCart,
  getCheckout,
  postOrder,
  getOrders,
  getInvoice,
  createCheckoutSession,
  getSuccess,
  getCancel,
};
