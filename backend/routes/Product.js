const express = require("express");
const { createProduct, getProduct, updateProduct, deleteProduct,  createProductReview, getReview, deleteReview, getProductDetails } = require("../controllers/Product");
const { isAuthenticated, authorizeRole } = require("../middlewares/auth");
const router = express.Router();

router.route("/admin/create/new").post(isAuthenticated, authorizeRole("admin"), createProduct)

router.route("/admin/get/products").get(getProduct)

router
    .route("/admin/product/:id")
    .put(isAuthenticated, authorizeRole("admin"), updateProduct)
    .delete(isAuthenticated, authorizeRole("admin"), deleteProduct)

router.route("/product/:id").get(isAuthenticated, getProductDetails)

router.route("/create/review").post(isAuthenticated, createProductReview)

router
    .route("/reviews")
    .get(getReview)
    .delete(isAuthenticated, deleteReview)

module.exports = router