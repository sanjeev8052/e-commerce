const Product = require("../models/Product");
const ApiFeatures = require("../utils/apiFeature");



// add new product 
exports.createProduct = async (req, res, next) => {
  try {
    req.body.user = req.user._id;
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getProduct = async (req, res, next) => {
  try {
    const resultPerPage = 5;

    const apiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const products = await apiFeature.query;

    res.status(200).json({
      success: true,
      // length:products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found.." });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.deleteProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found.." });
    }

    await product.remove();
    res
      .status(200)
      .json({ success: true, message: "Product delete successfully.." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getProductDetails = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "product not found.." });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// create new review and update the review

exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = await product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      console.log(true);
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          (rev.rating = rating), (rev.comment = comment);
        }
      });
    } else {
      console.log(false);
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReview = async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: true, message: "Product not found" });
    }

    res.status(200).json({ success: true, reviews: product.reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.query.productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: true, message: "Product not found" });
    }

    const reviews = await product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
    console.log(reviews.length);
    let avg = 0;
    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    const ratings = avg / reviews.length;
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
      }
    );

    res.status(200).json({ success: true, message: "Delete Reviews" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
