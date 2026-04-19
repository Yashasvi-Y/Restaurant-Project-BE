const MenuItem = require('../models/MenuItem');

// Get all menu items with optional filtering
const getMenuItems = async (req, res) => {
  try {
    const { category, section, allergen, dietary, isSpecial } = req.query;
    
    // Build filter object
    let filter = {};
    if (category) filter.category = category;
    if (section) filter.section = section;
    if (allergen) filter.allergens = { $nin: [allergen] }; // Exclude items with this allergen
    if (dietary) filter.dietaryTags = dietary;
    if (isSpecial === 'true') filter.isSpecial = true;
    
    const items = await MenuItem.find(filter).sort({ category: 1, section: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu items', error: error.message });
  }
};

// Get single menu item
const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu item', error: error.message });
  }
};

// Create menu item (Admin only)
const createMenuItem = async (req, res) => {
  try {
    const { category, section, name, description, price, allergens, dietaryTags, isSpecial, specialBadge, image } = req.body;
    
    if (!category || !section || !name || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newItem = new MenuItem({
      category,
      section,
      name,
      description,
      price,
      allergens: allergens || [],
      dietaryTags: dietaryTags || [],
      isSpecial: isSpecial || false,
      specialBadge: specialBadge || null,
      image
    });
    
    await newItem.save();
    res.status(201).json({ message: 'Menu item created', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create menu item', error: error.message });
  }
};

// Update menu item (Admin only)
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const item = await MenuItem.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json({ message: 'Menu item updated', item });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update menu item', error: error.message });
  }
};

// Delete menu item (Admin only)
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await MenuItem.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete menu item', error: error.message });
  }
};

// Get allergen/dietary filter options
const getFilterOptions = async (req, res) => {
  try {
    const allergens = await MenuItem.distinct('allergens');
    const dietaryTags = await MenuItem.distinct('dietaryTags');
    const categories = await MenuItem.distinct('category');
    
    res.json({
      allergens: allergens.filter(a => a),
      dietaryTags: dietaryTags.filter(d => d),
      categories
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch filter options', error: error.message });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getFilterOptions
};
