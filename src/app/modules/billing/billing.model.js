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
    email: {
      type: String,
      required: true,
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
