// Schema for pending registrations (new file: models/PendingUser.js)
const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  insname: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    default: "Excellence in Education",
  },
  insaddress: {
    type: String,
    default: "Your Institute Address Here",
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PendingUser", pendingUserSchema);
