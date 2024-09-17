import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError.js';
import { Billing } from './billing.model.js';


const createBilling = async payload => {
  const billing = await Billing.create(payload);

  return billing;
};


export const BillingService = {
  createBilling,
};
