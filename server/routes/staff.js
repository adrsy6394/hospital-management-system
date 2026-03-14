const express = require('express');
const { 
  createStaff, 
  getStaff, 
  getStaffMember, 
  updateStaff, 
  deleteStaff 
} = require('../controllers/staffController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.post('/', protect, authorize('admin'), createStaff);
router.get('/', protect, authorize('admin'), getStaff);
router.get('/:id', protect, authorize('admin'), getStaffMember);
router.put('/:id', protect, authorize('admin'), updateStaff);
router.delete('/:id', protect, authorize('admin'), deleteStaff);

module.exports = router;
