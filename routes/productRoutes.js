const express = require("express");
const router = express.Router();
const { productsList, productById, createProduct, productsByTerm } = require("../controllers/productController");
const uploadPictureMiddleware = require('../middlewares/uploadPictureMiddleware');
// @desc Fetch all products
// @route GET /api/products
// @access Public
router.get("/", productsList);

// @desc Fetch single products
// @route GET /api/products/:id
// @access Public
router.get(
  "/:id",
    productById
);

// @desc Add product
// @route POST /api/products/add
// @access Public
router.post('/add', uploadPictureMiddleware.single('image'), createProduct);
//req.file is 'image' file;

// @desc Search products by term
// @route GET /api/products/search/:term
// @access Public
router.get('/search/:term', productsByTerm);

module.exports = router;
