import { Router } from 'express';
import { AdvertisementController } from './advertisement.controller.js';
import multer from 'multer';
import auth from '../../middlewares/auth.js';
const storage = multer.diskStorage({});
const upload = multer({ storage });

const router = Router();

router
  .route('/')
  .post(
    auth('admin'),
    upload.single('image'),
    AdvertisementController.createAdvertisement,
  )
  .get(AdvertisementController.getAdvertisements);

router
  .route('/:id')
  .get(AdvertisementController.getAdvertisementById)
  .patch(
    auth('admin'),
    upload.single('image'),
    AdvertisementController.updateAdvertisement,
  )
  .delete(auth('admin'), AdvertisementController.deleteAdvertisement);

export const advertisementRoutes = router;
