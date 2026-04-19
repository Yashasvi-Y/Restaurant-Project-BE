const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public routes
router.get('/', staffController.getStaffMembers);
router.get('/:id', staffController.getStaffById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, staffController.createStaffMember);
router.put('/:id', authMiddleware, adminMiddleware, staffController.updateStaffMember);
router.delete('/:id', authMiddleware, adminMiddleware, staffController.deleteStaffMember);

module.exports = router;
