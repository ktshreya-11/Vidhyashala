const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'professional'], required: true },
  googleId: String,
  linkedinId: String,
  institution: String, // For Students
  company: String,     // For Professionals
  experience: String   // For Professionals
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
