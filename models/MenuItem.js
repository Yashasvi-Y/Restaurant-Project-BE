const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Lunch', 'Dinner', 'Breakfast', 'Beverages'],
    required: true
  },
  section: {
    type: String,
    required: true // e.g., 'Starters', 'Mains', 'Desserts'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  
  // Allergen & Dietary Info
  allergens: [String], // e.g., ['nuts', 'dairy', 'gluten']
  dietaryTags: [String], // e.g., ['vegan', 'vegetarian', 'gluten-free']
  
  // Seasonal Specials
  isSpecial: {
    type: Boolean,
    default: false
  },
  specialBadge: {
    type: String,
    default: null // e.g., 'Chef\'s Special', 'Seasonal', 'Limited'
  },
  
  // Images
  image: {
    type: String,
    default: null // URL to image
  },
  
  // Availability
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    default: 20 // minutes
  },
  
  // Ratings
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
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

module.exports = mongoose.model('MenuItem', menuItemSchema);
