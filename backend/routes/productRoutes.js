const express = require('express');
const router = express.Router();
const Product = require('../models/ProductModel');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// @route  GET /api/products
// @desc   List all marketplace products
// @access Private
router.get('/', protect, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/products
// @desc   Add a product (Admin only)
// @access Private/Admin
router.post('/', protect, restrictTo('Admin'), async (req, res) => {
  try {
    const { name, price, image, description } = req.body;
    if (!name || price == null || !image) {
      return res.status(400).json({ success: false, message: 'name, price, and image are required.' });
    }
    const product = await Product.create({ name, price: parseFloat(price), image, description });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
