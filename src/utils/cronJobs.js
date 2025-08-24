import cron from 'node-cron';
import { ReferralService } from '../app/modules/referral/referral.service.js';

/**
 * Initialize all cron jobs
 */
export const initializeCronJobs = () => {
  // Update expired referrals every day at 2 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      console.log('🕐 Running expired referrals update cron job...');
      const result = await ReferralService.updateExpiredReferrals();
      console.log(`✅ Expired referrals updated: ${result.modifiedCount} referrals marked as invalid`);
    } catch (error) {
      console.error('❌ Error in expired referrals cron job:', error);
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Kolkata' // Indian timezone
  });

  console.log('✅ Cron jobs initialized successfully');
};

/**
 * Manual function to update expired referrals (can be called via API)
 */
export const runExpiredReferralsUpdate = async () => {
  try {
    console.log('🕐 Manually running expired referrals update...');
    const result = await ReferralService.updateExpiredReferrals();
    console.log(`✅ Expired referrals updated: ${result.modifiedCount} referrals marked as invalid`);
    return result;
  } catch (error) {
    console.error('❌ Error in manual expired referrals update:', error);
    throw error;
  }
};
