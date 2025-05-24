import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError.js';
import { Advertisement } from './advertisement.model.js';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import config from '../../../config/config.js';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

const createAdvertisement = async (payload, file) => {
  if (file?.path) {
    const result = await cloudinary.v2.uploader.upload(file.path);
    const imageUrl = result.secure_url;

    payload.image = imageUrl;
  }

  const advertisement = await Advertisement.create(payload);
  return advertisement;
};

const getAdvertisements = async () => {
  const advertisements = await Advertisement.find({}).sort({
    createdAt: -1,
  });
  return advertisements;
};

const getAdvertisementById = async id => {
  const advertisement = await Advertisement.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    },
  ]);
  if (!advertisement) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Advertisement not found');
  }
  return advertisement[0];
};

const updateAdvertisement = async (id, payload, file) => {
  if (file?.path) {
    const result = await cloudinary.v2.uploader.upload(file.path);
    const imageUrl = result.secure_url;
    payload.image = imageUrl;
  }

  const updatedAdvertisement = await Advertisement.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
    },
  );

  if (!updatedAdvertisement) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Advertisement not found');
  }

  return updatedAdvertisement;
};

const deleteAdvertisement = async id => {
  const isExist = await Advertisement.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Advertisement not found!');
  }

  const result = await Advertisement.findByIdAndDelete(id);
  return result;
};

export const AdvertisementService = {
  createAdvertisement,
  getAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
};
