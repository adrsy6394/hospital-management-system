const Staff = require('../models/Staff');

// @desc    Create new staff
// @route   POST /api/staff
// @access  Private (Admin)
const createStaff = async (req, res) => {
  try {
    // Generate staffId safely (avoids collisions on delete)
    let staffId;
    let attempts = 0;
    while (attempts < 5) {
      const lastStaff = await Staff.findOne().sort({ createdAt: -1 }).select('staffId');
      let nextNum = 1;
      if (lastStaff && lastStaff.staffId) {
        const lastNum = parseInt(lastStaff.staffId.replace('STF', ''), 10);
        nextNum = lastNum + 1;
      }
      staffId = `STF${String(nextNum).padStart(6, '0')}`;
      const exists = await Staff.findOne({ staffId });
      if (!exists) break;
      nextNum++;
      staffId = `STF${String(nextNum).padStart(6, '0')}`;
      attempts++;
    }

    const staffData = { ...req.body, staffId };
    const staff = await Staff.create(staffData);
    res.status(201).json({ success: true, data: staff });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(400).json({ success: false, message: `A user with this ${field} already exists.` });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all staff
// @route   GET /api/staff
// @access  Private (Admin)
const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find().populate('userId', 'name email phone');
    res.json({ success: true, count: staff.length, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single staff member
// @route   GET /api/staff/:id
// @access  Private (Admin)
const getStaffMember = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('userId', 'name email phone');
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update staff
// @route   PUT /api/staff/:id
// @access  Private (Admin)
const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete staff
// @route   DELETE /api/staff/:id
// @access  Private (Admin)
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }
    res.json({ success: true, message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createStaff, getStaff, getStaffMember, updateStaff, deleteStaff };
