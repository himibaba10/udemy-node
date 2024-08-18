const express = require("express");
const {
  getAddProducts,
  postAddProducts,
  getProducts,
  getEditProducts,
  postEditProduct,
  postDeleteProduct,
} = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", getAddProducts);
router.get("/products", getProducts);

router.get("/edit-product/:productId", getEditProducts);
// router.post("/edit-product", postEditProduct);

// /admin/add-product => POST
router.post("/add-product", postAddProducts);

// router.post("/delete-product", postDeleteProduct);

module.exports = router;
