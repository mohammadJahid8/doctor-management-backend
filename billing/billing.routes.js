const express = require('express');
const router = express.Router();
const billingController = require('./billing.controller');

// ... other routes ...

router.put('/:id', billingController.updateBilling);
router.delete('/:id', billingController.deleteBilling);

module.exports = router; 
