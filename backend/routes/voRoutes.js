const express = require('express');
const router = express.Router();
const VO = require('../models/VoModel');
const SHG = require('../models/ShgModel');
const { protect } = require('../middleware/authMiddleware');

// @route  GET /api/vos
// @desc   Get all Village Organizations
// @access Private
router.get('/', protect, async (req, res) => {
  try {
    const vos = await VO.find().sort({ name: 1 });
    res.json(vos);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/shgs?voId=xxx
// @desc   Get SHGs filtered by VO
// @access Private
router.get('/shgs', protect, async (req, res) => {
  try {
    const { voId } = req.query;
    if (!voId) return res.json([]);
    const shgs = await SHG.find({ voId }).sort({ name: 1 });
    res.json(shgs);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/vos
// @desc   Create a new VO (Admin only)
// @access Private/Admin
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Only Admins can create VOs.' });
    }
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'VO name is required.' });

    const vo = await VO.create({ name });
    res.status(201).json({ success: true, data: vo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/vos/shgs
// @desc   Create a new SHG under a VO (Admin only)
// @access Private/Admin
router.post('/shgs', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Only Admins can create SHGs.' });
    }
    const { name, voId } = req.body;
    if (!name || !voId) return res.status(400).json({ success: false, message: 'Name and voId are required.' });

    const vo = await VO.findById(voId);
    if (!vo) return res.status(404).json({ success: false, message: 'VO not found.' });

    const shg = await SHG.create({ name, voId });
    res.status(201).json({ success: true, data: shg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
