const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public route - submit contact form
router.post('/', contactController.createContact);

// Admin routes
router.get('/admin/stats', authMiddleware, adminMiddleware, contactController.getContactStats);
router.get('/', authMiddleware, adminMiddleware, contactController.getAllContacts);
router.get('/:id', authMiddleware, adminMiddleware, contactController.getContact);
router.put('/:id', authMiddleware, adminMiddleware, contactController.updateContactStatus);
router.post('/:contactId/reply', authMiddleware, adminMiddleware, contactController.sendReplyEmail);
router.delete('/:id', authMiddleware, adminMiddleware, contactController.deleteContact);

module.exports = router;
