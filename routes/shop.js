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
} = require("../controllers/shop");

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/product/:productId", getProduct);

router.get("/cart", getCart);
router.post("/cart", postCart);
router.post("/delete-cart-product", deleteCart);

router.get("/orders", getOrders);

router.get("/checkout", getCheckout);

module.exports = router;
