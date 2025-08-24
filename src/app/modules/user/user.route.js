import express from 'express';
import { UserController } from './user.controller.js';
import auth from '../../middlewares/auth.js';
import multer from 'multer';
const storage = multer.diskStorage({});

const upload = multer({ storage });
const router = express.Router();

router.post('/signup', UserController.signup);
router.post('/create-google-user', UserController.createGoogleUser);

router.post('/signin', UserController.signin);
router.get('/profile', auth('doctor', 'admin'), UserController.getUserProfile);

router.get('/', UserController.getAllUsers);

router.delete('/delete/:id', auth('doctor', 'admin'), UserController.deleteUser);

router.patch('/update/:id', auth('doctor', 'admin'), upload.single('image'), UserController.updateUser);

router.patch('/activate-referral', auth('doctor', 'admin'), UserController.activateReferral);

router.patch(
  '/image/:id',
  // upload.single('image'),
  auth('doctor', 'admin'),
  UserController.updateUserImage,
);

router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', UserController.resetPassword);

router.post('/create-subscription', UserController.createSubscription);
router.post('/save-subscription/:email', UserController.saveSubscription);

export const UserRoutes = router;
