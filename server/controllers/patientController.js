const Patient = require('../models/Patient');

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private (Staff/Admin)
const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(400).json({ success: false, message: `An account with this ${field} already exists.` });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (Admin/Doctor/Staff)
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('userId', 'name email phone');
    res.json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('userId', 'name email phone');
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private (Staff/Admin)
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current patient profile
// @route   GET /api/patients/me
// @access  Private (Patient)
const getMe = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id }).populate('userId', 'name email phone');
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private (Admin only)
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createPatient, getPatients, getPatient, updatePatient, deletePatient, getMe };
