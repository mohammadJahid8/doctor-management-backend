const Billing = require('./billing.model');

exports.createBilling = async (billingData) => {
  const newBilling = new Billing(billingData);
  return await newBilling.save();
};
