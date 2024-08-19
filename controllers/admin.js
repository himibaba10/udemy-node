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
  const product = new Product(
    req.body.title,
    req.body.price,
    req.body.imageUrl,
    req.body.description,
    req.user._id
  );

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

  Product.update(req.body.id, productData)
    .then((result) => {
      if (result.modifiedCount > 0) {
        console.log("Product updated successfully");
        return res.redirect("/admin/products");
      }

      return res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

const postDeleteProduct = (req, res, next) => {
  Product.delete(req.body.id)
    .then((result) => {
      if (result.deletedCount > 0) {
        console.log("Product deleted successfully");
        return res.redirect("/admin/products");
      }

      return res.redirect("/");
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
