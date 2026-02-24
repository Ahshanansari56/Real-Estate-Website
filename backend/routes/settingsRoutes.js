const express = require('express');
const router = express.Router();
const { getSettings, updateSetting, updateBulkSettings, deleteSetting } = require('../controllers/settingsController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getSettings);
router.post('/', protect, adminOnly, updateSetting);
router.post('/bulk', protect, adminOnly, updateBulkSettings);
router.delete('/:key', protect, adminOnly, deleteSetting);

module.exports = router;
