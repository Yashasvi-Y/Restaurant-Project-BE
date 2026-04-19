const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public routes
router.get('/', reviewController.getApprovedReviews);
router.get('/menu-item/:menuItemId', reviewController.getReviewsForMenuItem);
router.post('/:id/like', reviewController.likeReview);

// Protected user routes
router.get('/user/my-reviews', authMiddleware, reviewController.getUserReviews);
router.post('/', authMiddleware, reviewController.submitReview);

// Admin routes
router.get('/admin/pending', authMiddleware, adminMiddleware, reviewController.getPendingReviews);
router.put('/:id/approve', authMiddleware, adminMiddleware, reviewController.approveReview);
router.delete('/:id/reject', authMiddleware, adminMiddleware, reviewController.rejectReview);

module.exports = router;
