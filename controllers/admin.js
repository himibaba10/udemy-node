const { validationResult } = require("express-validator");
const Product = require("../models/product");
const handleError = require("../utils/handleError");

const getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
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
    errorMessage: null,
    validationErrors: null,
  });
};

const postAddProducts = (req, res, next) => {
  const errors = validationResult(req);

  const productInfo = {
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.file.path,
    description: req.body.description,
    userId: req.session.user._id,
  };

  if (!errors.isEmpty()) {
    const errorMessage = errors
      .array()
      .map((err) => err.msg)
      .join("; ");

    const titleError = errors.array().some((el) => el.path === "title");
    const imageError = errors.array().some((el) => el.path === "image");
    const priceError = errors.array().some((el) => el.path === "price");
    const descriptionError = errors
      .array()
      .some((el) => el.path === "description");

    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      product: productInfo,
      isAuthenticated: req.session.isLoggedIn,
      errorMessage,
      validationErrors: {
        titleError,
        imageError,
        priceError,
        descriptionError,
      },
    });
  }

  const product = new Product(productInfo);

  product
    .save()
    .then(() => {
      console.log("Product created successfully");
      res.redirect("/admin/products");
    })
    .catch((err) => next(handleError(err)));
};

const getEditProducts = (req, res, next) => {
  Product.findById(req.params.productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        product,
        editing: true,
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: null,
        validationErrors: null,
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
    image: req.file,
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
  Product.findOneAndDelete({ _id: req.body.id, userId: req.user._id })
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
