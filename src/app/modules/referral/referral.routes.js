import { Router } from 'express';

import auth from '../../middlewares/auth.js';
import { ReferralController } from './referral.controller.js';
const router = Router();

// Create referral (admin only)
router
  .route('/')
  .post(
    auth('admin'),
    ReferralController.createReferral,
  )
  .get(ReferralController.getReferrals);

// Get referral by ID
router
  .route('/:id')
  .get(ReferralController.getReferralById)
  .patch(
    auth('admin'),
    ReferralController.updateReferral,
  )
  .delete(
    auth('admin'),
    ReferralController.deleteReferral,
  );

// Validate referral code (public)
router
  .route('/validate')
  .post(ReferralController.validateReferralCode);

// Use referral code (public)
router
  .route('/use')
  .post(ReferralController.useReferralCode);

// Update expired referrals (admin only)
router
  .route('/update-expired')
  .post(
    auth('admin'),
    ReferralController.updateExpiredReferrals,
  );

export const referralRoutes = router;
