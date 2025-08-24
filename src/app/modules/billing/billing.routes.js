import express from 'express';
import { BillingController } from './billing.controller.js';

const router = express.Router();

router.get('/', BillingController.getAllBilling);
router.post('/create', BillingController.createBilling);
// router.post('/generate-invoice', BillingController.generateInvoice);
router.patch('/update/:id', BillingController.updateBilling);
router.delete('/delete/:id', BillingController.deleteBilling);

export const BillingRoutes = router;
