import express from 'express';
import { createCourse, addLesson, getUploadUrl, getInstructorStats, getInstructorCourses } from '../controllers/courseController.js';
import { protect, instructor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, instructor, getInstructorStats);
router.get('/', protect, instructor, getInstructorCourses);
router.post('/', protect, instructor, createCourse);
router.post('/:courseId/modules/:moduleId/lessons', protect, instructor, addLesson);
router.get('/:courseId/upload-url', protect, instructor, getUploadUrl);

export default router;
