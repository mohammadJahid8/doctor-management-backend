import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError.js';
import { Article } from './article.model.js';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import config from '../../../config/config.js';

cloudinary.v2.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

const createArticle = async (payload, file) => {
  if (file?.path) {
    const result = await cloudinary.v2.uploader.upload(file.path);
    const imageUrl = result.secure_url;

    payload.image = imageUrl;
  }

  const article = await Article.create(payload);

  return article;
};

const getAllArticles = async () => {
  const articles = await Article.find({}).sort({
    createdAt: -1,
  });
  return articles;
};

const getArticleById = async id => {
  const article = await Article.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    },
  ]);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'article not found');
  }
  return article[0];
};

const updateArticle = async (id, payload) => {
  const updatedArticle = await Article.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!updatedArticle) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Article not found');
  }

  return updatedArticle;
};

const deleteArticle = async id => {
  const isExist = await Article.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus[500], 'Article not found!');
  }

  const result = await Article.findByIdAndDelete(id);
  return result;
};

export const ArticleService = {
  createArticle,
  getAllArticles,
  deleteArticle,
  updateArticle,
  getArticleById,
};
