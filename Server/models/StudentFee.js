
const mongoose = require("mongoose");

const studentFeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  standard: { type: String, required: true },
  totalFees: { type: Number, required: true },
  feesPaid: { type: Number, required: true },
  email: { type: String, required: true },
  paymentMode: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentDate: { type: Date, default: Date.now },
  dateOfAdmission: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StudentFee", studentFeeSchema);
