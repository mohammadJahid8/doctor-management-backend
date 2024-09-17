/* eslint-disable no-prototype-builtins */

import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
import { BillingService } from './billing.service.js';

const createBilling = catchAsync(async (req, res) => {
  const result = await BillingService.createBilling(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Billing created successfully',
     result,
  });
});


export const BillingController = {
  createBilling,
};
