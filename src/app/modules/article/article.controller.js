/* eslint-disable no-prototype-builtins */

import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
import { ArticleService } from './article.service.js';

const createArticle = catchAsync(async (req, res) => {
  const result = await ArticleService.createArticle(req.body, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Article created successfully',
    data: result,
  });
});

const getAllArticles = catchAsync(async (req, res) => {
  const result = await ArticleService.getAllArticles(
    req.query.user,
    req.query.role,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Articles got!',
    data: result,
  });
});
const getArticleById = catchAsync(async (req, res) => {
  const result = await ArticleService.getArticleById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Article got!',
    data: result,
  });
});

const updateArticle = catchAsync(async (req, res) => {
  const id = req.params.id;
  let updatedData = req.body;

  const result = await ArticleService.updateArticle(id, updatedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Article updated successfully!',
    data: result,
  });
});

const deleteArticle = catchAsync(async (req, res) => {
  const result = await ArticleService.deleteArticle(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Article deleted successfully!',
    data: result,
  });
});

export const ArticleController = {
  createArticle,
  getAllArticles,
  deleteArticle,
  updateArticle,
  getArticleById,
};
