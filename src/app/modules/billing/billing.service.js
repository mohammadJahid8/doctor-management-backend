import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError.js';
import { Billing } from './billing.model.js';
import Razorpay from 'razorpay';
import config from '../../../config/config.js';

console.log(config.razorPay_key_id);

const rp = new Razorpay({
  key_id: config.razorPay_key_id,
  key_secret: config.razorPay_key_secret,
});

const createBilling = async payload => {
  try {
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
    const userId = req?.query?.userId;
    const role = req?.query?.role;

    if (role === 'doctor') {
      const billing = await Billing.find({ doctor: userId }).populate('doctor');
      return {
        message: 'Billing got successfully',
        code: 200,
        data: billing,
      };
    } else if (role === 'admin') {
      const billing = await Billing.find({}).populate('doctor');
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

const generateInvoice = async billing => {
  try {
    const line_items = billing.items.map(item => ({
      name: item.name,
      amount: Number(item.amount) * 100,
    }));

    const fullInvoice = await rp.invoices.create({
      type: 'invoice',
      customer: {
        name: billing.patientName,
        contact: billing.phoneNumber,
        email: billing.email,
      },
      line_items,
    });

    if (fullInvoice) {
      const invoiceData = {
        invoiceId: fullInvoice.id,
        invoiceUrl: fullInvoice.short_url,
      };

      const id = billing._id;
      await Billing.findByIdAndUpdate(
        id,
        {
          $set: {
            invoice: invoiceData,
          },
        },
        {
          new: true,
        },
      );

      return {
        message: 'Invoice generated successfully',
        code: 200,
        data: invoiceData,
      };
    } else {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Cannot generate invoice',
      );
    }
  } catch (error) {
    console.log('errrror', error);
    throw new ApiError(error.statusCode, error.error.description);
  }
};

const updateBilling = async (id, payload) => {
  try {
    const billing = await Billing.findByIdAndUpdate(id, payload, { new: true });
    if (!billing) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Billing not found!');
    }
    return {
      message: 'Billing updated successfully',
      code: 200,
      billing,
    };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error',
    );
  }
};

const deleteBilling = async id => {
  try {
    const billing = await Billing.findByIdAndDelete(id);
    if (!billing) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Billing not found!');
    }

    return {
      message: 'Billing deleted successfully',
      code: 200,
      data: null,
    };
  } catch (error) {
    console.log(error);
  }
};

export const BillingService = {
  createBilling,
  getAllBilling,
  updateBilling,
  deleteBilling,
  generateInvoice,
};
