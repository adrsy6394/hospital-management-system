const Bill = require('../models/Bill');

// @desc    Create new bill
// @route   POST /api/bills
// @access  Private (Staff/Admin)
const createBill = async (req, res) => {
  try {
    const bill = await Bill.create(req.body);
    res.status(201).json({ success: true, data: bill });
  } catch (error) {
    console.error('Bill creation error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Duplicate bill key. Please try again.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private (Admin/Staff)
const getBills = async (req, res) => {
  try {
    let query = {};
    
    // If patient, only show their bills
    if (req.user.role === 'patient') {
      const Patient = require('../models/Patient');
      const patient = await Patient.findOne({ userId: req.user._id });
      if (patient) {
        query.patientId = patient._id;
      } else {
        return res.json({ success: true, count: 0, data: [] });
      }
    }

    const bills = await Bill.find(query)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate('appointmentId');
    res.json({ success: true, count: bills.length, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single bill
// @route   GET /api/bills/:id
// @access  Private
const getBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('patientId')
      .populate('appointmentId');
    
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }
    res.json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient bills
// @route   GET /api/bills/patient/:patientId
// @access  Private
const getPatientBills = async (req, res) => {
  try {
    const bills = await Bill.find({ patientId: req.params.patientId })
      .populate('appointmentId');
    res.json({ success: true, count: bills.length, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update bill
// @route   PUT /api/bills/:id
// @access  Private (Staff/Admin)
const updateBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }
    res.json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete bill
// @route   DELETE /api/bills/:id
// @access  Private (Admin)
const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }
    res.json({ success: true, message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  createBill, 
  getBills, 
  getBill, 
  getPatientBills, 
  updateBill, 
  deleteBill 
};
