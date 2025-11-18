// app/api/create-stripe-session/route.js

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
        console.error("STRIPE_SECRET_KEY is missing or invalid.");
        return NextResponse.json({
            message: 'Server configuration error: Stripe Secret Key is missing or incomplete.'
        }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { amount, userId } = body;

        if (!amount || !userId) {
            return NextResponse.json({ message: 'Missing amount or user ID' }, { status: 400 });
        }

        // --- THE FIX: Create the Session and include redirect URLs directly ---
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Pro Plan Subscription',
                            description: '2,00,000 Tokens per month',
                        },
                        unit_amount: amount,
                        recurring: { interval: 'month' },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            // Stripe will use these URLs to redirect the user after payment
            success_url: `${req.headers.get('origin')}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/`,
            client_reference_id: userId,
        });

        // Return the full URL for the frontend to navigate to
        return NextResponse.json({ url: session.url }, { status: 200 });

    } catch (error) {
        console.error('Stripe Session Creation Error:', error);
        return NextResponse.json({ message: 'Failed to create payment session', error: error.message }, { status: 500 });
    }
}