const express = require('express');
const router = express.Router();
const {
  createProperty, getAllProperties, getProperty, updateProperty,
  deleteProperty, getMyProperties, getDashboardStats
} = require('../controllers/realEstateController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAllProperties);
router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/my', protect, getMyProperties);
router.get('/:id', getProperty);
router.post('/', protect, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
