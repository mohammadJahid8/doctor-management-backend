import { Schema, model } from 'mongoose';

const billingSchema = new Schema(
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
    phoneNumber: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    roomNo: {
      type: String,
      required: false,
    },
    admissionNo: {
      type: String,
      required: false,
    },
    dateOfAdmission: {
      type: String,
      required: false,
    },
    dateOfDischarge: {
      type: String,
      required: false,
    },

    date: {
      type: String,
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    invoice: {
      invoiceId: { type: String, required: false },
      invoiceUrl: { type: String, required: false },
    },
  },
  {
    timestamps: true,
  },
);

export const Billing = model('Billing', billingSchema);
