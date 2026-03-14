const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffId: {
    type: String,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  department: {
    type: String,
    required: [true, 'Please provide department'],
  },
  position: {
    type: String,
    required: [true, 'Please provide position'],
  },
  shift: {
    type: String,
    enum: ['morning', 'evening', 'night'],
  },
  salary: {
    type: Number,
  },
  joiningDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate staff ID
staffSchema.pre('save', async function (next) {
  if (!this.staffId) {
    const count = await mongoose.model('Staff').countDocuments();
    this.staffId = `STF${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Staff', staffSchema);
