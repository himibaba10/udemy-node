const express = require("express");
const {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProduct,
  postCart,
  deleteCart,
  postOrder,
  getInvoice,
  createCheckoutSession,
  getSuccess,
  getCancel,
} = require("../controllers/shop");
const { isAuth } = require("../middlewares/is-auth");

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/product/:productId", getProduct);

router.get("/cart", isAuth, getCart);
router.post("/cart", isAuth, postCart);
router.post("/delete-cart-product", isAuth, deleteCart);

router.post("/create-order", isAuth, postOrder);
router.get("/orders", isAuth, getOrders);
router.get("/orders/:orderId", isAuth, getInvoice);
router.post("/create-checkout-session", isAuth, createCheckoutSession);

router.get("/checkout/success", isAuth, getSuccess);
router.get("/checkout/cancel", isAuth, getCancel);

router.get("/checkout", isAuth, getCheckout);

module.exports = router;
