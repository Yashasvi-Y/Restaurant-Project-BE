const Booking = require('../models/Booking');
const User = require('../models/User');
const { sendBookingConfirmationEmail } = require('../services/emailService');

// Create booking
const createBooking = async (req, res) => {
  try {
    // Accept both field name formats (from frontend or API)
    const {
      guestName, name,
      guestEmail, email,
      guestPhone, phone,
      numberOfGuests,
      reservationDate,
      reservationTime,
      duration,
      specialRequests,
      kitchenTour
    } = req.body;
    
    const userId = req.user?.id || req.body.userId;
    
    console.log('📝 Creating booking...');
    console.log('  User ID from token:', req.user?.id);
    console.log('  Request body:', req.body);
    
    // Map field names (accept both formats)
    const finalGuestName = guestName || name;
    const finalGuestEmail = guestEmail || email;
    const finalGuestPhone = guestPhone || phone;
    
    // Validation
    if (!finalGuestName || !finalGuestEmail || !numberOfGuests || !reservationDate || !reservationTime) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    if (numberOfGuests < 1 || numberOfGuests > 50) {
      console.log('❌ Invalid number of guests');
      return res.status(400).json({ message: 'Number of guests must be between 1 and 50' });
    }
    
    // Check if date is not in the past
    const resDate = new Date(reservationDate + 'T00:00:00');
    console.log('  Reservation date:', reservationDate);
    console.log('  Parsed date:', resDate);
    console.log('  Current date:', new Date());
    
    if (isNaN(resDate.getTime())) {
      console.log('❌ Invalid date format');
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    // Set time to start of day (00:00:00) for proper comparison
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    if (resDate < startOfToday) {
      console.log('❌ Reservation date in the past');
      return res.status(400).json({ message: 'Reservation date cannot be in the past' });
    }
    
    const newBooking = new Booking({
      userId,
      guestName: finalGuestName,
      guestEmail: finalGuestEmail,
      guestPhone: finalGuestPhone,
      numberOfGuests,
      reservationDate: resDate,
      reservationTime,
      duration: duration || 120,
      specialRequests: specialRequests || '',
      kitchenTour: kitchenTour || false,
      status: 'confirmed'
    });
    
    console.log('  Booking object:', newBooking);
    
    await newBooking.save();
    console.log('✓ Booking saved:', newBooking._id);
    
    // Add to user's bookings if logged in
    if (userId) {
      console.log('  Adding booking to user:', userId);
      const updateResult = await User.findByIdAndUpdate(userId, { $push: { bookings: newBooking._id } });
      console.log('  User update result:', updateResult ? '✓' : '❌ User not found');
    }
    
    // Send confirmation email
    try {
      console.log('  Sending confirmation email to:', finalGuestEmail);
      await sendBookingConfirmationEmail(finalGuestEmail, newBooking);
      console.log('✓ Email sent');
    } catch (emailError) {
      console.warn('⚠ Booking created but email failed to send:', emailError.message);
    }
    
    res.status(201).json({ 
      message: 'Booking created successfully',
      booking: newBooking,
      confirmationNumber: newBooking.confirmationNumber
    });
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    console.error('  Error type:', error.name);
    console.error('  Error message:', error.message);
    console.error('  Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to create booking', 
      error: error.message,
      details: error.name 
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const bookings = await Booking.find({ userId });
    
    // Sort: upcoming bookings first (nearest dates), then past bookings
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const upcoming = bookings.filter(b => new Date(b.reservationDate) >= now)
      .sort((a, b) => new Date(a.reservationDate) - new Date(b.reservationDate));
    
    const past = bookings.filter(b => new Date(b.reservationDate) < now)
      .sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate));
    
    const sorted = [...upcoming, ...past];
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

// Get booking by confirmation number
const getBookingByConfirmation = async (req, res) => {
  try {
    const { confirmationNumber } = req.params;
    
    const booking = await Booking.findOne({ confirmationNumber });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch booking', error: error.message });
  }
};

// Get all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const { status, date } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.reservationDate = { $gte: startDate, $lt: endDate };
    }
    
    const bookings = await Booking.find(filter)
      .populate('userId', 'name email phone');
    
    // Sort: upcoming bookings first (nearest dates), then past bookings
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const upcoming = bookings.filter(b => new Date(b.reservationDate) >= now)
      .sort((a, b) => new Date(a.reservationDate) - new Date(b.reservationDate));
    
    const past = bookings.filter(b => new Date(b.reservationDate) < now)
      .sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate));
    
    const sorted = [...upcoming, ...past];
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

// Update booking status (Admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update booking', error: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingByConfirmation,
  getAllBookings,
  updateBookingStatus,
  cancelBooking
};
