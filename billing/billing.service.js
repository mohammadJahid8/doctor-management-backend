const Billing = require('../models/billing.model');

exports.createBilling = async (billingData) => {
  try {
    const billing = await Billing.create(billingData);
    return billing;
  } catch (error) {
    throw error;
  }
};

exports.getBillings = async () => {
  try {
    const billings = await Billing.findAll();
    return billings;
  } catch (error) {
    throw error;
  }
};

exports.getBillingById = async (id) => {
  try {
    const billing = await Billing.findByPk(id);
    if (!billing) {
      throw new Error('Billing not found');
    }
    return billing;
  } catch (error) {
    throw error;
  }
};

exports.updateBilling = async (id, billingData) => {
  try {
    const billing = await Billing.findByPk(id);
    if (!billing) {
      throw new Error('Billing not found');
    }
    await billing.update(billingData);
    return billing;
  } catch (error) {
    throw error;
  }
};

exports.deleteBilling = async (id) => {
  try {
    const billing = await Billing.findByPk(id);
    if (!billing) {
      throw new Error('Billing not found');
    }
    await billing.destroy();
  } catch (error) {
    throw error;
  }
};
