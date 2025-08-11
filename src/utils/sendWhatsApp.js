import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsAppNumber = 'whatsapp:+918790986015'; // Twilio sandbox number

const client = twilio(accountSid, authToken);

// Send a WhatsApp template message
export const sendWhatsAppTemplate = async (to, templateSid, templateParams = []) => {
  try {
    const res = await client.messages.create({
      from: fromWhatsAppNumber,
      to: `whatsapp:${to}`,
      contentSid: templateSid, // Twilio template SID
      contentVariables: JSON.stringify(templateParams), // Variables for the template
    });
    console.log(`✅ WhatsApp template sent: ${res.sid}`);
    return res;
  } catch (err) {
    console.error(`❌ WhatsApp template send failed: ${err.message}`);
    throw err;
  }
};
