const express = require('express');
const { 
  createPatient, 
  getPatients, 
  getPatient, 
  updatePatient, 
  deletePatient,
  getMe 
} = require('../controllers/patientController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.get('/me', protect, getMe);
router.post('/', protect, authorize('admin', 'staff'), createPatient);
router.get('/', protect, authorize('admin', 'doctor', 'staff'), getPatients);
router.get('/:id', protect, getPatient);
router.put('/:id', protect, authorize('admin', 'staff'), updatePatient);
router.delete('/:id', protect, authorize('admin'), deletePatient);

module.exports = router;
