import Course from '../models/Course.js';

export const getCourses = async (req, res) => {
    try {
        // Normally you'd use Redis caching here
        const courses = await Course.find({ status: 'published' }).populate('instructor', 'name');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name');
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const searchCourses = async (req, res) => {
    try {
        // Mock Elasticsearch / MongoDB Atlas search
        const keyword = req.query.q ? {
            title: {
                $regex: req.query.q,
                $options: 'i',
            },
        } : {};
        const courses = await Course.find({ ...keyword, status: 'published' });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
