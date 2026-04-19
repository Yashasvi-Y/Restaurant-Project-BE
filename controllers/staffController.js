const Staff = require('../models/Staff');

// Get all staff members
const getStaffMembers = async (req, res) => {
  try {
    const staff = await Staff.find({ isActive: true }).sort({ name: 1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch staff', error: error.message });
  }
};

// Get single staff member
const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch staff', error: error.message });
  }
};

// Create staff member (Admin only)
const createStaffMember = async (req, res) => {
  try {
    const { name, role, bio, speciality, image, socialLinks, experienceYears, certifications, highlights } = req.body;
    
    if (!name || !role) {
      return res.status(400).json({ message: 'Name and role are required' });
    }
    
    const newStaff = new Staff({
      name,
      role,
      bio,
      speciality,
      image,
      socialLinks,
      experienceYears,
      certifications,
      highlights
    });
    
    await newStaff.save();
    res.status(201).json({ message: 'Staff member created', staff: newStaff });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create staff member', error: error.message });
  }
};

// Update staff member (Admin only)
const updateStaffMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const staff = await Staff.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    res.json({ message: 'Staff member updated', staff });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update staff member', error: error.message });
  }
};

// Delete staff member (Admin only)
const deleteStaffMember = async (req, res) => {
  try {
    const { id } = req.params;
    
    const staff = await Staff.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    res.json({ message: 'Staff member deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete staff member', error: error.message });
  }
};

module.exports = {
  getStaffMembers,
  getStaffById,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember
};
