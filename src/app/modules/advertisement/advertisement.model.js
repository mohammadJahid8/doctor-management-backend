import { Schema, model } from 'mongoose';

const advertisementSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Advertisement = model('Advertisement', advertisementSchema);
