import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
import { ReferralService } from './referral.service.js';

const createReferral = catchAsync(async (req, res) => {
  const result = await ReferralService.createReferral(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Referral created successfully and email sent',
    data: result,
  });
});

const getReferrals = catchAsync(async (req, res) => {
  const filters = {
    isValid: req.query.isValid !== undefined ? req.query.isValid === 'true' : undefined,
    isUsed: req.query.isUsed !== undefined ? req.query.isUsed === 'true' : undefined,
    email: req.query.email,
    doctorName: req.query.doctorName,
  };

  const result = await ReferralService.getReferrals(filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Referrals fetched successfully',
    data: result,
  });
});

const getReferralById = catchAsync(async (req, res) => {
  const result = await ReferralService.getReferralById(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Referral fetched successfully',
    data: result,
  });
});

const updateReferral = catchAsync(async (req, res) => {
  const result = await ReferralService.updateReferral(req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Referral updated successfully',
    data: result,
  });
});

const deleteReferral = catchAsync(async (req, res) => {
  const result = await ReferralService.deleteReferral(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

const validateReferralCode = catchAsync(async (req, res) => {
  const result = await ReferralService.validateReferralCode(req.body.code);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Referral code is valid',
    data: result,
  });
});

const useReferralCode = catchAsync(async (req, res) => {
  const result = await ReferralService.useReferralCode(req.body.code);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Referral code used successfully',
    data: result,
  });
});

const updateExpiredReferrals = catchAsync(async (req, res) => {
  const result = await ReferralService.updateExpiredReferrals();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Expired referrals updated successfully',
    data: result,
  });
});

export const ReferralController = {
  createReferral,
  getReferrals,
  getReferralById,
  updateReferral,
  deleteReferral,
  validateReferralCode,
  useReferralCode,
  updateExpiredReferrals,
};
