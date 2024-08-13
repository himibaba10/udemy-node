const Product = require("../models/product");

const getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
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
  Product.findByPk(req.params.productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        product,
        editing: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const postEditProduct = (req, res, next) => {
  Product.findByPk(req.body.id)
    .then((product) => {
      product.title = req.body.title;
      product.price = req.body.price;
      product.imageUrl = req.body.imageUrl;
      product.description = req.body.description;

      return product.save();
    })
    .then(() => {
      console.log("Product updated successfully");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

const postDeleteProduct = (req, res, next) => {
  Product.findByPk(req.body.id)
    .then((product) => {
      return product.destroy();
    })
    .then(() => {
      console.log("Product deleted successfully");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
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
