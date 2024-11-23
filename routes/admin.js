const express = require("express");
const {
  getAddProducts,
  postAddProducts,
  getProducts,
  getEditProducts,
  postEditProduct,
  deleteProduct,
} = require("../controllers/admin");
const { isAuth } = require("../middlewares/is-auth");
const { body } = require("express-validator");

const router = express.Router();

// GET ROUTES
router.get("/add-product", isAuth, getAddProducts);
router.get("/products", isAuth, getProducts);
router.get("/edit-product/:productId", isAuth, getEditProducts);

// POST ROUTES
router.post("/edit-product", isAuth, postEditProduct);
router.post(
  "/add-product",
  isAuth,
  [
    body("title")
      .isAlphanumeric("en-US", { ignore: " " })
      .withMessage("Title can only contain alphabets and numbers"),
    body("price").isFloat({ min: 0 }).withMessage("Price can't be negative"),
    body("description")
      .isLength({ min: 10 })
      .withMessage("Minimum 10 words is required"),
  ],
  postAddProducts
);

// DELETE ROUTES
router.delete("/product/:productId", isAuth, deleteProduct);

module.exports = router;
