import { Schema, model } from 'mongoose';

const reviewSchema = new Schema(
  {
    image: {
      type: String,
      required: false,
      default: 'https://i.ibb.co/mcHGwPy/dummy.jpg',
    },
    name: {
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
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Review = model('Review', reviewSchema);
