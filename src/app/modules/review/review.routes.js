import express from 'express';
import { ReviewController } from './review.controller.js';

const router = express.Router();

router.post('/create', ReviewController.createReview);
router.get('/', ReviewController.getAllReviews);
router.delete('/delete/:id', ReviewController.deleteReview);

export const ReviewRoutes = router;
