import mongoose from 'mongoose';

const enrollmentSchema = mongoose.Schema(
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
        accessType: {
            type: String,
            enum: ['lifetime', 'subscription'],
            default: 'lifetime'
        },
        status: {
            type: String,
            enum: ['active', 'revoked'],
            default: 'active'
        }
    },
    {
        timestamps: true,
    }
);

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;
