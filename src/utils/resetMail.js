// This file is now deprecated. Use the new emailService.js instead.
// Keeping this for backward compatibility

import { sendPasswordResetEmail } from './emailService.js';

export const resetMail = async (email, link) => {
  return sendPasswordResetEmail(email, link);
};
