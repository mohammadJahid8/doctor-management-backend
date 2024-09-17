const billingService = require('./billing.service');

// ... other functions ...

exports.updateBilling = async (req, res) => {
  try {
    const billingId = req.params.id;
    const updatedBilling = await billingService.updateBilling(billingId, req.body);
    res.status(200).json(updatedBilling);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBilling = async (req, res) => {
  try {
    const billingId = req.params.id;
    await billingService.deleteBilling(billingId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
