const BillingService = require('../services/billing.service');

exports.createBilling = async (req, res) => {
  try {
    const billing = await BillingService.createBilling(req.body);
    res.status(201).json({
      status: 'success',
       billing,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getBillings = async (req, res) => {
  try {
    const billings = await BillingService.getBillings();
    res.status(200).json({
      status: 'success',
       billings,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getBillingById = async (req, res) => {
  try {
    const billing = await BillingService.getBillingById(req.params.id);
    res.status(200).json({
      status: 'success',
       billing,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.updateBilling = async (req, res) => {
  try {
    const billing = await BillingService.updateBilling(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
       billing,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.deleteBilling = async (req, res) => {
  try {
    await BillingService.deleteBilling(req.params.id);
    res.status(204).json({
      status: 'success',
      message: 'Billing deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
