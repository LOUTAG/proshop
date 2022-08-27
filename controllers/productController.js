const mongoose = require("mongoose");
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const fs = require('fs');

module.exports.productsList = asyncHandler(async (req, res) => {
  const pageSize = 2;
  const page = Number(req.query.page) || 1;
  const count = await Product.countDocuments();
  const products = await Product.find({}).limit(pageSize).skip(pageSize*(page-1));
  res.json({products, page, pages: Math.ceil(count/pageSize)});
});

module.exports.productById = asyncHandler(async (req, res) => {
  //check if valid id
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid URL");
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

module.exports.createProduct = asyncHandler(async(req, res)=>{
  try{
    const { title, price, description } = req.body;
    if(!title || price===undefined || !description ) throw new Error('field are missing');
    
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name : title,
      image: `/images/${req.file.filename}`,
      brand: 'test',
      category: mongoose.Types.ObjectId('62ea53d8f5e3a919cb4ba028'),
      description: description,
      price: price,
      countInStock: 10
    });
    await product.save();
    res.json('Product has been added with success');
  }catch(error){
    res.status(404);
    fs.unlink(`client/public/images/${req.file.filename}`, function(err){
      if(err) throw new Error(err);
    });
    throw error;
  }
});
// @desc Search products by term
// @route GET /api/products/search/:term
// @access Public
module.exports.productsByTerm=asyncHandler(async(req, res)=>{
  const {term} = req.params;
  try{
    const products = await Product.find({name: {$regex: term, $options: 'i'}})
    console.log(products);
    res.json(products); 
  }catch(error){
   res.status(500);
   throw error;
  }
});