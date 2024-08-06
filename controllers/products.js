const products = [];

const getAddProducts = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

const postAddProducts = (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
};

const getProducts = (req, res, next) => {
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
  });
};

module.exports = {
  getProducts,
  getAddProducts,
  postAddProducts,
  products,
};
