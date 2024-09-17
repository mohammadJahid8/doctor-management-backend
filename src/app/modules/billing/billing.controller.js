/* eslint-disable no-prototype-builtins */

import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
import { BillingService } from './billing.service.js';

const createBilling = catchAsync(async (req, res) => {
  const result = await BillingService.createBilling(req.body);

  sendResponse(res, {
    statusCode: result.code || 200,
    success: true,
    message: result.message || '',
    data: result.data || null,
  });
});

const getAllBilling = catchAsync(async (req, res) => {
  const result = await BillingService.getAllBilling(req);

  sendResponse(res, {
    statusCode: result.code || 200,
    success: true,
    message: result.message || '',
    data: result.data || null,
  });
});

export const BillingController = {
  createBilling,
  getAllBilling,
};
