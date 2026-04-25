const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Booking Details
  guestName: {
    type: String,
    required: true
  },
  guestEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  guestPhone: {
    type: String,
    default: ''
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  
  // Reservation Details
  reservationDate: {
    type: Date,
    required: true
  },
  reservationTime: {
    type: String,
    required: true // e.g., "19:00"
  },
  duration: {
    type: Number,
    default: 120 // minutes
  },
  
  // Special Requests
  specialRequests: {
    type: String,
    default: ''
  },
  
  kitchenTour: {
    type: Boolean,
    default: false
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  
  // Cancellation tracking
  cancelledBy: {
    type: String,
    enum: ['user', 'admin', null],
    default: null
  },
  cancellationReason: {
    type: String,
    default: null
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  
  // Confirmation
  confirmationNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ FIXED pre-save (NO next, NO crash)
bookingSchema.pre('save', function () {
  if (!this.confirmationNumber) {
    this.confirmationNumber =
      'RES-' +
      Date.now() +
      Math.random().toString(36).substring(2, 9).toUpperCase();
  }

  this.updatedAt = Date.now();
});


// ✅ Prevent past bookings
bookingSchema.pre('validate', function () {
  const today = new Date();
  const selected = new Date(this.reservationDate);

  today.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);

  if (selected < today) {
    throw new Error('Reservation date cannot be in the past');
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
