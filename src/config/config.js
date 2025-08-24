import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,

  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,

  twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
  twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
  twilio_phone: process.env.TWILIO_PHONE,
  twilio_whatsapp_number: process.env.TWILIO_WHATSAPP_PHONE,
  twilio_template_sid: process.env.TWILIO_TEMPLATE_SID,
  whatsapp_template_sid: process.env.WHATSAPP_TEMPLATE_SID,

  razorPay_key_id: process.env.RAZOR_PAY_KEY_ID,
  razorPay_key_secret: process.env.RAZOR_PAY_KEY_SECRET,
};
