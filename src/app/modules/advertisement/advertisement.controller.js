import catchAsync from '../../../shared/catchAsync.js';
import sendResponse from '../../../shared/sendResponse.js';
import { AdvertisementService } from './advertisement.service.js';

const createAdvertisement = catchAsync(async (req, res) => {
  const result = await AdvertisementService.createAdvertisement(
    req.body,
    req.file,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Advertisement created successfully',
    data: result,
  });
});

const getAdvertisements = catchAsync(async (req, res) => {
  const result = await AdvertisementService.getAdvertisements();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Advertisements fetched successfully',
    data: result,
  });
});

const getAdvertisementById = catchAsync(async (req, res) => {
  const result = await AdvertisementService.getAdvertisementById(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Advertisement fetched successfully',
    data: result,
  });
});

const updateAdvertisement = catchAsync(async (req, res) => {
  const result = await AdvertisementService.updateAdvertisement(
    req.params.id,
    req.body,
    req.file,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Advertisement updated successfully',
    data: result,
  });
});

const deleteAdvertisement = catchAsync(async (req, res) => {
  const result = await AdvertisementService.deleteAdvertisement(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Advertisement deleted successfully',
    data: result,
  });
});

export const AdvertisementController = {
  createAdvertisement,
  getAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
};
