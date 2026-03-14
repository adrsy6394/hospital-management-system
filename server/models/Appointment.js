const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    unique: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  date: {
    type: Date,
    required: [true, 'Please provide appointment date'],
  },
  timeSlot: {
    startTime: String,
    endTime: String,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled',
  },
  notes: {
    type: String,
  },
  symptoms: {
    type: String,
  },
  diagnosis: {
    type: String,
  },
  prescription: [{
    medicine: String,
    dosage: String,
    duration: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate appointment ID (avoids collision on delete)
appointmentSchema.pre('validate', async function (next) {
  if (!this.appointmentId) {
    let appointmentId;
    let attempts = 0;
    while (attempts < 5) {
      const lastAppt = await mongoose.model('Appointment').findOne().sort({ createdAt: -1 }).select('appointmentId');
      let nextNum = 1;
      if (lastAppt && lastAppt.appointmentId) {
        const lastNum = parseInt(lastAppt.appointmentId.replace('APT', ''), 10);
        nextNum = isNaN(lastNum) ? 1 : lastNum + 1;
      }
      appointmentId = `APT${String(nextNum).padStart(6, '0')}`;
      const exists = await mongoose.model('Appointment').findOne({ appointmentId });
      if (!exists) break;
      nextNum++;
      appointmentId = `APT${String(nextNum).padStart(6, '0')}`;
      attempts++;
    }
    this.appointmentId = appointmentId;
  }
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
