
const mongoose = require("mongoose");

const feePaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  paymentMode: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now }
});

const studentFeeSchema = new mongoose.Schema({
  stdID: {type: String, required: true, unique: true},
  name: { type: String, required: true },
  standard: { type: String, required: true },
  totalFees: { type: Number, required: true },
  feesPaid: { type: Number, required: true },
  feePayments: [feePaymentSchema],
  email: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateOfAdmission: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StudentFee", studentFeeSchema);
