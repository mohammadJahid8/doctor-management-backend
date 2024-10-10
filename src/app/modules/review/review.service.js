import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError.js';
import { Review } from './review.model.js';

const createReview = async (payload) => {
  const review = await Review.create(payload);
  return review;
};

const getAllReviews = async () => {
  const reviews = await Review.find({}).sort({ createdAt: -1 });
  return reviews;
};

const deleteReview = async (id) => {
  const isExist = await Review.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus[500], 'Review not found!');
  }
  const result = await Review.findByIdAndDelete(id);
  return result;
};

export const ReviewService = {
  createReview,
  getAllReviews,
  deleteReview,
};
