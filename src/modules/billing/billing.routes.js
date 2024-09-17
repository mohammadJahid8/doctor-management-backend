import express from 'express';
import { BillingController } from './billing.controller.js';

const router = express.Router();

router.post('/create', BillingController.createBilling);


export const BillingRoutes = router;
