import { Referral } from '../app/modules/referral/referral.model.js';

/**
 * Generates a unique referral code in the format DOCXXXXX
 * @returns {Promise<string>} The generated referral code
 */
export const generateReferralCode = async () => {
  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'DOC';
    
    // Generate 5 random alphanumeric characters
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  };

  let code;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loops

  // Keep generating until we get a unique code
  while (!isUnique && attempts < maxAttempts) {
    code = generateCode();
    
    // Check if code already exists in database
    const existingReferral = await Referral.findOne({ code });
    if (!existingReferral) {
      isUnique = true;
    }
    
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Unable to generate unique referral code after maximum attempts');
  }

  return code;
};
