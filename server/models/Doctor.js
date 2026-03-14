const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  specialization: {
    type: String,
    required: [true, 'Please provide specialization'],
  },
  qualification: {
    type: String,
    required: [true, 'Please provide qualification'],
  },
  experience: {
    type: Number,
    required: [true, 'Please provide years of experience'],
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    slots: [{
      startTime: String,
      endTime: String,
      isBooked: {
        type: Boolean,
        default: false,
      },
    }],
  }],
  consultationFee: {
    type: Number,
    required: [true, 'Please provide consultation fee'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate doctor ID
doctorSchema.pre('save', async function (next) {
  if (!this.doctorId) {
    const count = await mongoose.model('Doctor').countDocuments();
    this.doctorId = `DOC${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Doctor', doctorSchema);
