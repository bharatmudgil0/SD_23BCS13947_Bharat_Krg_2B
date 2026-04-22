import mongoose from 'mongoose';

const progressSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Course',
        },
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        durationSec: { type: Number, default: 0 },
        maxPositionSec: { type: Number, default: 0 },
        lastPositionSec: { type: Number, default: 0 },
        completed: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
);

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
