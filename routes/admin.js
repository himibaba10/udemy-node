const express = require("express");
const {
  getAddProducts,
  postAddProducts,
  getProducts,
  getEditProducts,
  postEditProduct,
  postDeleteProduct,
} = require("../controllers/admin");
const { isAuth } = require("../middlewares/is-auth");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, getAddProducts);
router.get("/products", isAuth, getProducts);

router.get("/edit-product/:productId", isAuth, getEditProducts);
router.post("/edit-product", isAuth, postEditProduct);

// /admin/add-product => POST
router.post("/add-product", isAuth, postAddProducts);

router.post("/delete-product", isAuth, postDeleteProduct);

module.exports = router;
