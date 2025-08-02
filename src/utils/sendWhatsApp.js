import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsAppNumber = 'whatsapp:+14155238886'; // Twilio sandbox number

const client = twilio(accountSid, authToken);

export const sendWhatsAppMessage = async (to, message) => {
  return client.messages.create({
    from: fromWhatsAppNumber,
    to: `whatsapp:${to}`,
    body: message,
  });
};
