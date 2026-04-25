const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public routes
router.post('/', authMiddleware, bookingController.createBooking);
router.get('/confirmation/:confirmationNumber', bookingController.getBookingByConfirmation);

// Protected user routes
router.get('/', authMiddleware, bookingController.getUserBookings);
router.delete('/:id', authMiddleware, bookingController.cancelBooking);

// Admin routes
router.get('/admin/all', authMiddleware, adminMiddleware, bookingController.getAllBookings);
router.put('/:id/status', authMiddleware, adminMiddleware, bookingController.updateBookingStatus);
router.put('/:id/cancel', authMiddleware, adminMiddleware, bookingController.cancelBooking);

module.exports = router;
