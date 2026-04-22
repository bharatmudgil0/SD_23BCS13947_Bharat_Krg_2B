import Progress from '../models/Progress.js';

export const updateProgress = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const { durationSec, maxPositionSec, lastPositionSec, completed } = req.body;
        
        let progress = await Progress.findOne({ user: req.user._id, course: courseId, lesson: lessonId });
        
        if (progress) {
            progress.durationSec += durationSec || 0;
            if (maxPositionSec > progress.maxPositionSec) progress.maxPositionSec = maxPositionSec;
            progress.lastPositionSec = lastPositionSec;
            if (completed) progress.completed = true;
            await progress.save();
        } else {
            progress = await Progress.create({
                user: req.user._id,
                course: courseId,
                lesson: lessonId,
                durationSec,
                maxPositionSec,
                lastPositionSec,
                completed
            });
        }
        
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPlaybackManifest = async (req, res) => {
    // Mock HLS manifest delivery
    res.json({ manifestUrl: `https://mock-cdn.cloudfront.net/videos/${req.params.courseId}/${req.params.lessonId}/master.m3u8` });
};

export const getProgress = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const progress = await Progress.findOne({ user: req.user._id, course: courseId, lesson: lessonId });
        res.json(progress || { completed: false, maxPositionSec: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
