const express = require('express');
const router = express.Router();
const { generateReport, getReports, getReport, deleteReport } = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, adminOnly, generateReport);
router.get('/', protect, adminOnly, getReports);
router.get('/:id', protect, adminOnly, getReport);
router.delete('/:id', protect, adminOnly, deleteReport);

module.exports = router;
