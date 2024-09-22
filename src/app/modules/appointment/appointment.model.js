import { Schema, model } from 'mongoose';

const appointmentSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },

    doctorName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    nextAppointmentDate: {
      type: String,
    },
    fee: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Appointment = model('Appointment', appointmentSchema);
