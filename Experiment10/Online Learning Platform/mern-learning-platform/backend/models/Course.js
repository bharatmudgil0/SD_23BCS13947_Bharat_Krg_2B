import mongoose from 'mongoose';

const lessonSchema = mongoose.Schema({
    title: { type: String, required: true },
    video_url: { type: String, required: true },
    duration: { type: Number, required: true }, // in seconds
    order_index: { type: Number, required: true }
}, { timestamps: true });

const moduleSchema = mongoose.Schema({
    title: { type: String, required: true },
    order_index: { type: Number, required: true },
    lessons: [lessonSchema]
}, { timestamps: true });

const courseSchema = mongoose.Schema(
    {
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        thumbnail_url: {
            type: String,
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft'
        },
        modules: [moduleSchema]
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
