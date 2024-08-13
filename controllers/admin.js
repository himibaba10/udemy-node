const Product = require("../models/product");

const getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Products",
      path: "/admin/products",
    });
  });
};

const getAddProducts = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    product: null,
  });
};

const postAddProducts = (req, res, next) => {
  Product.create({
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
  })
    .then(() => {
      console.log("Created product successfully");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

const getEditProducts = (req, res, next) => {
  Product.findById(req.params.productId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      product,
      editing: true,
    });
  });
};

const postEditProduct = (req, res, next) => {
  Product.update(req.body, () => {
    res.redirect("/admin/products");
  });
};

const postDeleteProduct = (req, res, next) => {
  Product.delete(req.body.id, () => {
    res.redirect("/admin/products");
  });
};

module.exports = {
  getProducts,
  getAddProducts,
  postAddProducts,
  getEditProducts,
  postEditProduct,
  postDeleteProduct,
};
