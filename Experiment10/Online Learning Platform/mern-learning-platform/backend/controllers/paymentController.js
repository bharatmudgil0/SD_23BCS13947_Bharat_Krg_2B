import Order from '../models/Order.js';
import Enrollment from '../models/Enrollment.js';
import Stripe from 'stripe';
import { addEnrollmentJob } from '../workers/enrollmentWorker.js';

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy';
const stripe = new Stripe(stripeKey);

export const checkout = async (req, res) => {
    try {
        const { courseId, courseName, amount } = req.body;
        
        if (stripeKey === 'sk_test_dummy') {
            // Instead of instantly fulfilling, redirect to the frontend Mock Checkout Page
            return res.status(200).json({ 
                id: 'mock_session_123', 
                url: `http://localhost:5173/checkout/${courseId}?name=${encodeURIComponent(courseName || 'Course Access')}&amount=${amount}` 
            });
        }

        // Create Stripe checkout session (Real flow)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: courseName || 'Course Access',
                        },
                        unit_amount: Math.round(amount * 100), // convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/catalog?success=true`,
            cancel_url: `${process.env.FRONTEND_URL}/catalog?canceled=true`,
            metadata: {
                userId: req.user._id.toString(),
                courseId: courseId.toString(),
            }
        });

        // Save order as pending
        await Order.create({
            user: req.user._id,
            course: courseId,
            amount,
            status: 'pending'
        });

        res.status(200).json({ id: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { userId, courseId } = session.metadata;
        
        // Update order status
        await Order.findOneAndUpdate(
            { user: userId, course: courseId, status: 'pending' },
            { status: 'success' }
        );

        // Add to Bull Queue for asynchronous enrollment processing
        addEnrollmentJob(userId, courseId);
    }

    res.json({ received: true });
};

export const mockConfirm = async (req, res) => {
    try {
        const { courseId, amount } = req.body;
        
        // Check if already enrolled
        const existingOrder = await Order.findOne({ user: req.user._id, course: courseId, status: 'success' });
        if (existingOrder) {
            return res.status(400).json({ message: 'Already enrolled in this course.' });
        }

        // Save order as success
        await Order.create({
            user: req.user._id,
            course: courseId,
            amount: Number(amount),
            status: 'success'
        });
        
        // Add enrollment directly to queue
        addEnrollmentJob(req.user._id.toString(), courseId.toString());
        
        res.status(200).json({ success: true, message: 'Payment confirmed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user._id }).populate('course');
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
