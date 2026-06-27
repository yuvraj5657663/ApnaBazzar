const express = require('express');
const router = express.Router();
const SHG = require('../models/ShgModel');
const { protect } = require('../middleware/authMiddleware');

// @route  GET /api/shgs?voId=xxx
// @desc   Get SHGs filtered by VO ID
// @access Private
router.get('/', protect, async (req, res) => {
  try {
    const { voId } = req.query;
    if (!voId) return res.json([]);
    const shgs = await SHG.find({ voId }).sort({ name: 1 });
    res.json(shgs);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
