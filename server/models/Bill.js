const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billId: {
    type: String,
    unique: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  services: [{
    name: String,
    description: String,
    amount: Number,
  }],
  consultationFee: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'partial'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'insurance'],
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate bill ID (avoids collision on delete)
billSchema.pre('validate', async function (next) {
  if (!this.billId) {
    let billId;
    let attempts = 0;
    while (attempts < 5) {
      const lastBill = await mongoose.model('Bill').findOne().sort({ createdAt: -1 }).select('billId');
      let nextNum = 1;
      if (lastBill && lastBill.billId) {
        const lastNum = parseInt(lastBill.billId.replace('BILL', ''), 10);
        nextNum = isNaN(lastNum) ? 1 : lastNum + 1;
      }
      billId = `BILL${String(nextNum).padStart(6, '0')}`;
      const exists = await mongoose.model('Bill').findOne({ billId });
      if (!exists) break;
      nextNum++;
      billId = `BILL${String(nextNum).padStart(6, '0')}`;
      attempts++;
    }
    this.billId = billId;
  }
  next();
});

module.exports = mongoose.model('Bill', billSchema);
