import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
    
  const category = req.query.category ? { category: req.query.category } : {};
  const status = { status: 'In Stock', isApproved: true };
  
  const count = await Product.countDocuments({ ...keyword, ...category, ...status });
  const products = await Product.find({ ...keyword, ...category, ...status })
    .populate('seller', 'name storeName')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'seller',
    'name storeName storeDescription'
  );

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    image,
    category,
    status,
    productType,
    downloadLink,
  } = req.body;

  const product = new Product({
    seller: req.user._id,
    title,
    description,
    price,
    image,
    category,
    status,
    productType,
    downloadLink: productType === 'Digital' ? downloadLink : '',
    isApproved: req.user.role === 'admin' ? true : false,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller
const updateProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    image,
    category,
    status,
    productType,
    downloadLink,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // Check if the user is the seller or an admin
    if (
      product.seller.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(401);
      throw new Error('Not authorized to update this product');
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;
    product.category = category || product.category;
    product.status = status || product.status;
    product.productType = productType || product.productType;
    
    if (product.productType === 'Digital') {
      product.downloadLink = downloadLink || product.downloadLink;
    } else {
      product.downloadLink = '';
    }

    // If a non-admin updates a product, it needs to be re-approved
    if (req.user.role !== 'admin') {
      product.isApproved = false;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Check if the user is the seller or an admin
    if (
      product.seller.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(401);
      throw new Error('Not authorized to delete this product');
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get seller products
// @route   GET /api/products/seller
// @access  Private/Seller
const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id });
  res.json(products);
});

// @desc    Approve a product
// @route   PUT /api/products/:id/approve
// @access  Private/Admin
const approveProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.isApproved = true;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get all products (including unapproved)
// @route   GET /api/products/admin
// @access  Private/Admin
const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate('seller', 'name email');
  res.json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  approveProduct,
  getAdminProducts,
};