import { Schema, model } from 'mongoose';

const referralSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    doctorName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: false,

    },
    validUntil: {
      type: Date,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save middleware to check validity based on date
referralSchema.pre('save', function (next) {
  // Check if validUntil date has passed
  if (this.validUntil && new Date() > this.validUntil) {
    this.isValid = false;
  }
  next();
});

// Static method to update validity of expired referrals
referralSchema.statics.updateExpiredReferrals = async function () {
  const now = new Date();
  return this.updateMany(
    {
      validUntil: { $lt: now },
      isValid: true
    },
    {
      $set: { isValid: false }
    }
  );
};

// Instance method to check if referral is valid
referralSchema.methods.isValidReferral = function () {
  return this.isValid && !this.isUsed && new Date() <= this.validUntil;
};

export const Referral = model('Referral', referralSchema);
