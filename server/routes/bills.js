const express = require('express');
const { 
  createBill, 
  getBills, 
  getBill, 
  getPatientBills, 
  updateBill, 
  deleteBill 
} = require('../controllers/billController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.post('/', protect, authorize('admin', 'staff'), createBill);
router.get('/', protect, authorize('admin', 'staff', 'patient'), getBills);
router.get('/:id', protect, getBill);
router.get('/patient/:patientId', protect, getPatientBills);
router.put('/:id', protect, authorize('admin', 'staff'), updateBill);
router.delete('/:id', protect, authorize('admin'), deleteBill);

module.exports = router;
