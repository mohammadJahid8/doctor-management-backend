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



import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError.js';
import { Billing } from './billing.model.js';
import mongoose from 'mongoose';

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
       billing,
    };
  } catch (error) {
    console.log({ error });
    if (error instanceof ApiError) {
      return {
        message: error.message,
        code: error.statusCode,
         null,
      };
    } else {
      return {
        message: 'Internal server error',
        code: httpStatus.INTERNAL_SERVER_ERROR,
         null,
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
         billing,
      };
    } else if (role === 'admin') {
      const billing = await Billing.find();
      return {
        message: 'Billing got successfully',
        code: 200,
         billing,
      };
    } else {
      return {
        message: 'Unauthorized access',
        code: httpStatus.UNAUTHORIZED,
         null,
      };
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        message: error.message,
        code: error.statusCode,
         null,
      };
    } else {
      return {
        message: 'Internal server error',
        code: httpStatus.INTERNAL_SERVER_ERROR,
         null,
      };
    }
  }
};

const updateBilling = async (id, payload) => {
  try {
    const updatedBilling = await Billing.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      payload,
      { new: true }
    );
    if (!updatedBilling) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Billing not found !');
    }
    return {
      message: 'Billing updated successfully',
      code: 200,
       updatedBilling,
    };
  } catch (error) {
    console.log({ error });
    if (error instanceof ApiError) {
      return {
        message: error.message,
        code: error.statusCode,
         null,
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

const deleteBilling = async id => {
  try {
    const result = await Billing.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Billing not found !');
    }
    return {
      message: 'Billing delete successfully',
      code: 200,
       result,
    };
  } catch (error) {
    console.log({ error });
    if (error instanceof ApiError) {
      return {
        message: error.message,
        code: error.statusCode,
         null,
      };
    } else {
      return {
        message: 'Internal server error',
        code: httpStatus.INTERNAL_SERVER_ERROR,
         null,
      };
    }
  }
};
export const BillingService = {
  createBilling,
  getAllBilling,
  updateBilling,
  deleteBilling,
};
