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

// router.get("/checkout", getCheckout);

module.exports = router;
