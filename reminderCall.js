require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const twilio = require('twilio');
const moment = require('moment');

// Twilio setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// MongoDB setup
const mongoUri = process.env.DATABASE_URL;
const dbName = 'doctor-management';

// Static Telugu audio files
const audioUrls = {
  hello: 'https://raw.githubusercontent.com/mohammadJahid8/doctor-management-backend/main/audio/hello-telugu.mp3',
  reminder: 'https://raw.githubusercontent.com/mohammadJahid8/doctor-management-backend/main/audio/reminder.mp3',
  thanks: 'https://raw.githubusercontent.com/mohammadJahid8/doctor-management-backend/main/audio/thanks.mp3',
  with: 'https://raw.githubusercontent.com/mohammadJahid8/doctor-management-backend/main/audio/undi.mp3',
};

async function runReminderCalls() {
  const clientDB = new MongoClient(mongoUri);
  await clientDB.connect();
  const db = clientDB.db(dbName);
  const appointments = db.collection('appointments');
  const users = db.collection('users');

  const tomorrow = moment().add(1, 'days').format('MMMM Do, YYYY');

  const results = await appointments.find({ nextAppointmentDate: tomorrow }).toArray();

  for (const appointment of results) {
    const doctor = await users.findOne({ _id: new ObjectId(appointment.doctor) });
    if (!doctor) {
      console.warn(`⚠️ Doctor not found for appointment: ${appointment._id}`);
      continue;
    }

    const patientName = appointment.patientName;
    const doctorName = doctor.name;
    const phone = appointment.phone;
    const state = doctor.hospitalAddress?.state?.toLowerCase() || '';

    console.log(`📞 Calling ${phone} | Patient: ${patientName} | Doctor: ${doctorName}`);

    const response = new twilio.twiml.VoiceResponse();
    
    if(state === 'andhra pradesh' || state === 'telangana'){
      response.play(audioUrls.hello);
      response.say({ voice: 'Polly.Aditi', language: 'en-IN' }, patientName);
      response.play(audioUrls.reminder);
      response.say({ voice: 'Polly.Aditi', language: 'en-IN' }, `Doctor ${doctorName}`);
      response.play(audioUrls.with);
      response.play(audioUrls.thanks);
    } else {
      // Hindi message (TTS only)
      response.say(
        { voice: 'Polly.Aditi', language: 'hi-IN' },
        `नमस्ते ${patientName}, यह एक रिमाइंडर है आपकी डॉक्टर ${doctorName} के साथ कल की अपॉइंटमेंट के लिए।`
      );
    }

    response.pause({ length: 1 });
    response.say(
      { voice: 'Polly.Aditi', language: 'en-IN' },
      `Hello ${appointment.patientName}, this is a reminder for your appointment with Doctor ${appointment.doctorName} tomorrow.`
    );

    try {
      const call = await client.calls.create({
        twiml: response.toString(),
        to: phone,
        from: process.env.TWILIO_PHONE
      });
      console.log(`✅ Call sent to ${phone}: ${call.sid}`);
    } catch (err) {
      console.error(`❌ Failed for ${phone}:`, err.message);
    }

    await sendWhatsAppReminder(phone, patientName, doctorName, tomorrow);
  }

  await clientDB.close();
}

async function sendWhatsAppReminder(phone, patientName, doctorName, appointmentDate) {
  try {
    const message = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`, // Your approved WhatsApp number
      to: `whatsapp:${phone}`,
      contentSid: process.env.WHATSAPP_TEMPLATE_SID, // SID from Twilio Content Template Builder
      contentVariables: JSON.stringify({
        1: patientName,
        2: doctorName,
        3: appointmentDate
      })
    });

    console.log(`✅ WhatsApp reminder sent to ${phone}: ${message.sid}`);
  } catch (err) {
    console.error(`❌ Failed to send WhatsApp to ${phone}:`, err.message);
  }
}

runReminderCalls();
