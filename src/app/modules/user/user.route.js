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

router.delete('/delete/:id', UserController.deleteUser);

router.patch('/update/:id', upload.single('image'), UserController.updateUser);

router.patch(
  '/image/:id',
  // upload.single('image'),
  UserController.updateUserImage,
);

router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', UserController.resetPassword);

export const UserRoutes = router;
