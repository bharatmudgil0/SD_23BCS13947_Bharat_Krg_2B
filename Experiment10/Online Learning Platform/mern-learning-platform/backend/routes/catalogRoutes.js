import express from 'express';
import { getCourses, getCourseById, searchCourses } from '../controllers/catalogController.js';

const router = express.Router();

router.get('/courses', getCourses);
router.get('/search', searchCourses);
router.get('/courses/:id', getCourseById);

export default router;
