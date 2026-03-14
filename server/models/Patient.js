const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  age: {
    type: Number,
    required: [true, 'Please provide age'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Please provide gender'],
  },
  address: {
    type: String,
    required: [true, 'Please provide address'],
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    notes: String,
  }],
  emergencyContact: {
    name: String,
    relation: String,
    phone: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate patient ID (avoids collision on delete)
patientSchema.pre('validate', async function (next) {
  if (!this.patientId) {
    let patientId;
    let attempts = 0;
    while (attempts < 5) {
      const lastPatient = await mongoose.model('Patient').findOne().sort({ createdAt: -1 }).select('patientId');
      let nextNum = 1;
      if (lastPatient && lastPatient.patientId) {
        const lastNum = parseInt(lastPatient.patientId.replace('PAT', ''), 10);
        nextNum = isNaN(lastNum) ? 1 : lastNum + 1;
      }
      patientId = `PAT${String(nextNum).padStart(6, '0')}`;
      const exists = await mongoose.model('Patient').findOne({ patientId });
      if (!exists) break;
      nextNum++;
      patientId = `PAT${String(nextNum).padStart(6, '0')}`;
      attempts++;
    }
    this.patientId = patientId;
  }
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
