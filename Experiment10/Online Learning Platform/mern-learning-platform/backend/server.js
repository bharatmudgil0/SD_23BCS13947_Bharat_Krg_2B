import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import { paymentRouter, progressRouter, playbackRouter } from './routes/paymentRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/instructor/courses', courseRoutes);
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/progress', progressRouter);
app.use('/api/v1/playback', playbackRouter);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
