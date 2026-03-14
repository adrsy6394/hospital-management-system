const Doctor = require('../models/Doctor');

// @desc    Create new doctor
// @route   POST /api/doctors
// @access  Private (Admin)
const createDoctor = async (req, res) => {
  try {
    // Generate doctorId by finding the last one (avoids collisions on delete)
    let doctorId;
    let attempts = 0;
    while (attempts < 5) {
      const lastDoctor = await Doctor.findOne().sort({ createdAt: -1 }).select('doctorId');
      let nextNum = 1;
      if (lastDoctor && lastDoctor.doctorId) {
        const lastNum = parseInt(lastDoctor.doctorId.replace('DOC', ''), 10);
        nextNum = lastNum + 1;
      }
      doctorId = `DOC${String(nextNum).padStart(6, '0')}`;
      // Check it doesn't already exist (safety check)
      const exists = await Doctor.findOne({ doctorId });
      if (!exists) break;
      nextNum++;
      doctorId = `DOC${String(nextNum).padStart(6, '0')}`;
      attempts++;
    }

    const docData = { ...req.body, doctorId };
    const doctor = await Doctor.create(docData);
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    // Friendly error for duplicate email/phone
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(400).json({ success: false, message: `A user with this ${field} already exists.` });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userId', 'name email phone');
    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email phone');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private (Admin/Doctor)
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private (Admin)
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createDoctor, getDoctors, getDoctor, updateDoctor, deleteDoctor };
