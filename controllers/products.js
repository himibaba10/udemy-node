const Product = require("../models/product");

const getAddProducts = (req, res, next) => {
  console.log("Ran");
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

const postAddProducts = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

const getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

module.exports = {
  getProducts,
  getAddProducts,
  postAddProducts,
};
