const { Billing } = require('../models');

// ... other functions ...

exports.updateBilling = async (billingId, billingData) => {
  return await Billing.findByIdAndUpdate(billingId, billingData, { new: true });
};

exports.deleteBilling = async (billingId) => {
  await Billing.findByIdAndDelete(billingId);
};
