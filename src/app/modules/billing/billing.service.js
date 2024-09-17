import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError.js';
import { Billing } from './billing.model.js';

const createBilling = async payload => {
  try {
    console.log({ payload });
    if (!payload) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No billing data!');
    }

    const billing = await Billing.create(payload);

    return {
      message: 'Billing created successfully',
      code: 200,
      data: billing,
    };
  } catch (error) {
    console.log({ error });
    if (error instanceof ApiError) {
      return {
        message: error.message,
        code: error.statusCode,
        data: null,
      };
    } else {
      return {
        message: 'Internal server error',
        code: httpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }
};

const getAllBilling = async req => {
  try {
    console.log(req.query);
    const userId = req?.query?.userId;
    const role = req?.query?.role;

    if (role === 'doctor') {
      const billing = await Billing.find({ doctor: userId }); // Use doctor field for doctor's billings
      return {
        message: 'Billing got successfully',
        code: 200,
        data: billing,
      };
    } else if (role === 'admin') {
      const billing = await Billing.find();
      return {
        message: 'Billing got successfully',
        code: 200,
        data: billing,
      };
    } else {
      return {
        message: 'Unauthorized access',
        code: httpStatus.UNAUTHORIZED,
        data: null,
      };
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        message: error.message,
        code: error.statusCode,
        data: null,
      };
    } else {
      return {
        message: 'Internal server error',
        code: httpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }
};



export const BillingService = {
  createBilling,
  getAllBilling,
};
