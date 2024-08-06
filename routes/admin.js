const express = require("express");
const { getAddProducts, postAddProducts } = require("../controllers/products");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", getAddProducts);

// /admin/add-product => POST
router.post("/add-product", postAddProducts);

module.exports = router;
