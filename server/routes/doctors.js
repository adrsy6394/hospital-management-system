const express = require('express');
const { 
  createDoctor, 
  getDoctors, 
  getDoctor, 
  updateDoctor, 
  deleteDoctor 
} = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.post('/', protect, authorize('admin'), createDoctor);
router.get('/', getDoctors); // Public route
router.get('/:id', getDoctor); // Public route
router.put('/:id', protect, authorize('admin', 'doctor'), updateDoctor);
router.delete('/:id', protect, authorize('admin'), deleteDoctor);

module.exports = router;
