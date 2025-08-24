
import { Referral } from './referral.model.js';
import { generateReferralCode } from '../../../utils/referralCodeGenerator.js';
import { sendReferralEmail } from '../../../utils/emailService.js';
import ApiError from '../../../errors/ApiError.js';
import httpStatus from 'http-status';

const createReferral = async (payload) => {
  // Generate unique referral code
  const code = await generateReferralCode();

  // Create referral with generated code
  const referralData = {
    ...payload,
    code,
  };

  const referral = await Referral.create(referralData);

  // Send email with referral code
  try {
    await sendReferralEmail(payload.email, {
      code: referral.code,
      doctorName: referral.doctorName,
      validUntil: referral.validUntil,
    });
  } catch (error) {
    console.error('Failed to send referral email:', error);
    // Don't throw error here, just log it
  }

  return referral;
};

const getReferrals = async (filters = {}) => {
  const query = {};

  // Apply filters
  if (filters.isValid !== undefined) {
    query.isValid = filters.isValid;
  }

  if (filters.isUsed !== undefined) {
    query.isUsed = filters.isUsed;
  }

  if (filters.email) {
    query.email = { $regex: filters.email, $options: 'i' };
  }

  if (filters.doctorName) {
    query.doctorName = { $regex: filters.doctorName, $options: 'i' };
  }

  const referrals = await Referral.find(query).sort({
    createdAt: -1,
  });

  return referrals;
};

const getReferralById = async (id) => {
  const referral = await Referral.findById(id);

  if (!referral) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found');
  }

  return referral;
};

const updateReferral = async (id, payload) => {
  const referral = await Referral.findById(id);

  if (!referral) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found');
  }

  // If email is being updated, send new email
  if (payload.email && payload.email !== referral.email) {
    try {
      await sendReferralEmail(payload.email, {
        code: referral.code,
        doctorName: payload.doctorName || referral.doctorName,
        validUntil: payload.validUntil || referral.validUntil,
      });
    } catch (error) {
      console.error('Failed to send updated referral email:', error);
    }
  }

  const updatedReferral = await Referral.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  );

  return updatedReferral;
};

const deleteReferral = async (id) => {
  const referral = await Referral.findById(id);

  if (!referral) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found');
  }

  await Referral.findByIdAndDelete(id);

  return { message: 'Referral deleted successfully' };
};

const validateReferralCode = async (code) => {
  const referral = await Referral.findOne({ code });

  if (!referral) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid referral code');
  }

  if (!referral.isValidReferral()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Referral code is invalid or expired');
  }

  return referral;
};

const useReferralCode = async (code) => {
  const referral = await Referral.findOne({ code });

  if (!referral) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid referral code');
  }

  if (!referral.isValidReferral()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Referral code is invalid or expired');
  }

  if (referral.isUsed) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Referral code has already been used');
  }

  // Mark as used
  referral.isUsed = true;
  await referral.save();

  return referral;
};

const updateExpiredReferrals = async () => {
  const result = await Referral.updateExpiredReferrals();
  return result;
};

export const ReferralService = {
  createReferral,
  getReferrals,
  getReferralById,
  updateReferral,
  deleteReferral,
  validateReferralCode,
  useReferralCode,
  updateExpiredReferrals,
};
