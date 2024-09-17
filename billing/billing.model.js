const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  // Define the billing schema fields here
  // Example:
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  // Add other fields as needed
}, { timestamps: true });

module.exports = mongoose.model('Billing', billingSchema); 
