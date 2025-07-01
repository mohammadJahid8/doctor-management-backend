/**
 * Defines the Mongoose schema and model for user data.
 * Includes fields for email, name, role, password (hashed), and image.
 * Provides methods for password hashing, password matching, and checking user existence.
 */

import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config/config.js';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: false,
    },
    speciality: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
      default: 'doctor',
    },
    subscription: {
      planId: { type: String, required: false },
      subscriptionId: { type: String, required: false },
      planName: { type: String, required: false },
      status: { type: String, required: false },
      billedAt: { type: Date, required: false },
    },
    unsubscribed: {
      planId: { type: String, required: false },
      planName: { type: String, required: false },
      status: { type: String, required: false },
      optedAt: { type: Date, required: false },
    },
    password: {
      type: String,
      required: false,
    },
    gstin: {
      type: String,
      required: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    hospitalName: {
      type: String,
      required: true,
      unique: true,
    },
    hospitalAddress: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      address: { type: String, required: true },
    },

    image: {
      type: String,
      required: false,
      default: 'https://i.ibb.co/mcHGwPy/dummy.jpg',
    },
    mapUrl: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema.statics.isPasswordMatch = async function (givenPass, savedPass) {
  const isMatch = await bcrypt.compare(givenPass, savedPass);

  return isMatch;
};

userSchema.pre('save', async function (next) {
  // hash password
  if (this.password) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  next();
});

userSchema.statics.isUserExist = async function (email) {
  const user = await User.findOne(
    { email },
    { email: 1, password: 1, role: 1, id: 1 },
  ).lean();

  return user;
};

export const User = model('User', userSchema);
