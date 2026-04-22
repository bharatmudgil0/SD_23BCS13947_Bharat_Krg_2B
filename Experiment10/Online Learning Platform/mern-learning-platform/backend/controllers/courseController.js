import Course from '../models/Course.js';
import Order from '../models/Order.js';
import { generatePresignedUrl } from '../utils/s3Service.js';

export const createCourse = async (req, res) => {
    try {
        const { title, description, category, price, thumbnail_url } = req.body;
        const course = new Course({
            instructor: req.user._id,
            title,
            description,
            category,
            price,
            thumbnail_url,
            status: 'published'
        });
        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addLesson = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, video_url, duration, order_index } = req.body;
        
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        
        // Simplified: push to first module or create one
        if (course.modules.length === 0) {
            course.modules.push({ title: 'Module 1', order_index: 1, lessons: [] });
        }
        
        course.modules[0].lessons.push({ title, video_url, duration, order_index });
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUploadUrl = async (req, res) => {
    try {
        const { fileName, fileType } = req.query;
        if (!fileName || !fileType) return res.status(400).json({ message: 'Missing fileName or fileType' });
        
        const key = `courses/${req.params.courseId}/${Date.now()}_${fileName}`;
        const uploadUrl = await generatePresignedUrl(key, fileType);
        
        res.json({ uploadUrl, key });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getInstructorStats = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user._id }).select('_id');
        const courseIds = courses.map(c => c._id);
        const orders = await Order.find({ course: { $in: courseIds }, status: 'success' });
        const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
        res.json({ totalRevenue, totalEnrollments: orders.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getInstructorCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user._id }).sort('-createdAt');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
