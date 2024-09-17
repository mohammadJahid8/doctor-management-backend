const express = require('express');
const router = express.Router();
const billingController = require('./billing.controller');

router.post('/', billingController.createBilling);

module.exports = router;
