const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true // e.g., 'Head Chef', 'Sous Chef', 'Sommelier'
  },
  bio: {
    type: String,
    default: ''
  },
  speciality: {
    type: String,
    default: '' // e.g., 'French Cuisine', 'Mixology'
  },
  image: {
    type: String,
    default: null // URL to staff image
  },
  socialLinks: {
    instagram: {
      type: String,
      default: null
    },
    twitter: {
      type: String,
      default: null
    },
    linkedin: {
      type: String,
      default: null
    }
  },
  experienceYears: {
    type: Number,
    default: 0
  },
  certifications: [String],
  highlights: [String], // e.g., ['Michelin Star', 'Award Winner']
  isActive: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('Staff', staffSchema);
