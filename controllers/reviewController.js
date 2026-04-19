const Review = require('../models/Review');
const User = require('../models/User');

// Get approved reviews (for public gallery)
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true })
      .populate('userId', 'name')
      .populate('menuItems', 'name')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

// Get all reviews for a menu item
const getReviewsForMenuItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    
    const reviews = await Review.find({ 
      menuItems: menuItemId, 
      isApproved: true 
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

// Submit a review (with photo)
const submitReview = async (req, res) => {
  try {
    const { rating, comment, photoUrl, menuItems, bookingId } = req.body;
    const userId = req.user.id;
    
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    if (comment.length < 10 || comment.length > 500) {
      return res.status(400).json({ message: 'Comment must be between 10 and 500 characters' });
    }
    
    const newReview = new Review({
      userId,
      rating,
      comment,
      photoUrl: photoUrl || null,
      menuItems: menuItems || [],
      bookingId: bookingId || null,
      isApproved: false // Requires admin approval
    });
    
    await newReview.save();
    
    // Add review to user's reviews array
    await User.findByIdAndUpdate(userId, { $push: { reviews: newReview._id } });
    
    res.status(201).json({ 
      message: 'Review submitted. It will be displayed after admin approval.',
      review: newReview 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit review', error: error.message });
  }
};

// Get pending reviews (Admin only)
const getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: false })
      .populate('userId', 'name email')
      .populate('menuItems', 'name')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending reviews', error: error.message });
  }
};

// Approve review (Admin only)
const approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved: true, approvedAt: new Date() },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json({ message: 'Review approved', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve review', error: error.message });
  }
};

// Reject review (Admin only)
const rejectReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Remove from user's reviews
    await User.findByIdAndUpdate(review.userId, { $pull: { reviews: id } });
    
    res.json({ message: 'Review rejected and deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject review', error: error.message });
  }
};

// Like a review
const likeReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json({ message: 'Review liked', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to like review', error: error.message });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const reviews = await Review.find({ userId })
      .populate('bookingId', 'reservationDate confirmationNumber')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user reviews', error: error.message });
  }
};

module.exports = {
  getApprovedReviews,
  getReviewsForMenuItem,
  submitReview,
  getPendingReviews,
  approveReview,
  rejectReview,
  likeReview,
  getUserReviews
};
