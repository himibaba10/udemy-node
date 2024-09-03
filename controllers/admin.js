const Product = require("../models/product");

const getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
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
    isAuthenticated: req.session.isLoggedIn,
  });
};

const postAddProducts = (req, res, next) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    userId: req.session.user._id,
  });

  product
    .save()
    .then(() => {
      console.log("Product created successfully");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

const getEditProducts = (req, res, next) => {
  Product.findById(req.params.productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        product,
        editing: true,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const postEditProduct = (req, res, next) => {
  const productData = {
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
  };

  Product.findByIdAndUpdate(req.body.id, productData)
    .then((result) => {
      console.log("Product updated successfully");
      return res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

const postDeleteProduct = (req, res, next) => {
  Product.findByIdAndDelete(req.body.id)
    .then((result) => {
      console.log("Product deleted successfully");
      return res.redirect("/admin/products");
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
