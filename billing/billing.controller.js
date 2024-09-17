const billingService = require('./billing.service');

exports.createBilling = async (req, res) => {
  try {
    const billingData = req.body;
    const createdBilling = await billingService.createBilling(billingData);
    res.status(201).json(createdBilling);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create billing' });
  }
};
