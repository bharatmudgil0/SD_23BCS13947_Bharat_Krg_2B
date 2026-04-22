import express from 'express';
import { checkout, getMyEnrollments, mockConfirm } from '../controllers/paymentController.js';
import { updateProgress, getPlaybackManifest, getProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const paymentRouter = express.Router();
paymentRouter.post('/checkout', protect, checkout);
paymentRouter.post('/mock-confirm', protect, mockConfirm);
paymentRouter.get('/my-courses', protect, getMyEnrollments);

const progressRouter = express.Router();
progressRouter.get('/courses/:courseId/lessons/:lessonId', protect, getProgress);
progressRouter.put('/courses/:courseId/lessons/:lessonId', protect, updateProgress);

const playbackRouter = express.Router();
playbackRouter.get('/courses/:courseId/lessons/:lessonId', protect, getPlaybackManifest);

export { paymentRouter, progressRouter, playbackRouter };
