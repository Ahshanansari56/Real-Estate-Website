const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser, toggleUserStatus } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);
router.patch('/:id/toggle', protect, adminOnly, toggleUserStatus);

module.exports = router;
