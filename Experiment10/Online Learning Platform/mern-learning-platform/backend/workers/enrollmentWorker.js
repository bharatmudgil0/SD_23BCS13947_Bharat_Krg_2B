// Removed Bull Queue to prevent Redis ECONNREFUSED spam
import Enrollment from '../models/Enrollment.js';

export const addEnrollmentJob = async (userId, courseId) => {
    try {
        console.log(`[Enrollment] Processing enrollment synchronously for User: ${userId}, Course: ${courseId}`);
        const enrollmentExists = await Enrollment.findOne({ user: userId, course: courseId });
        if (!enrollmentExists) {
            await Enrollment.create({ user: userId, course: courseId });
            console.log(`[Enrollment] Enrollment successfully created.`);
        } else {
            console.log(`[Enrollment] Enrollment already exists. Skipping.`);
        }
    } catch (error) {
        console.error(`[Enrollment] Error processing enrollment:`, error);
    }
};
