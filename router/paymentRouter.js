import express from 'express';
import stripe from '../config/stripe.js';
import {authenticate} from '../middleware/auth.js';

const paymentRouter = express.Router();

// Payment routes
paymentRouter.post('/payment/:enrollmentId', authenticate, async (req, res) => {

    const { payment_method_id, amount, enrollment_id } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            payment_method: payment_method_id,
            amount: amount * 100, // Convert amount to cents
            currency: 'usd', // Adjust currency as needed
            description: `Payment for Enrollment ID: ${enrollment_id}`,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never', // Disable redirects
            },
        });

        // Handle successful payment (update enrollment status, etc.)
        // For simplicity, assume enrollment update logic here

        res.status(200).json({ message: 'Payment successful!', paymentIntent });
    } catch (error) {
        console.error('Payment failed:', error);
        res.status(500).json({ error: 'Payment failed.' });
    }
});


// paymentRouter.get('/payments', authenticate, async (req, res) => {
//     if (req.user.role !== 'admin') {
//         return res.status(403).send({ error: 'Access denied' });
//     }
//     try {
//         const payments = await Payment.find().populate('user', 'firstName lastName').populate('course', 'title');
//         res.send(payments);
//     } catch (error) {
//         res.status(500).send();
//     }
// });

// paymentRouter.get('/payments/:id', authenticate, async (req, res) => {
//     try {
//         const payment = await Payment.findById(req.params.id).populate('user', 'firstName lastName').populate('course', 'title');
//         if (!payment) {
//             return res.status(404).send();
//         }
//         res.send(payment);
//     } catch (error) {
//         res.status(500).send();
//     }
// });

export default paymentRouter;