const express = require("express");
const {
  getAddProducts,
  postAddProducts,
  getProducts,
} = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", getAddProducts);
router.get("/products", getProducts);

// /admin/add-product => POST
router.post("/add-product", postAddProducts);

module.exports = router;
