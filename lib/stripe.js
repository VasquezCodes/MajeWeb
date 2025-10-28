// lib/stripe.js
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Falta STRIPE_SECRET_KEY en .env.local');
}

const globalForStripe = globalThis;

const stripe =
  globalForStripe._stripe ||
  new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
    appInfo: { name: 'MajeAcademy', version: '1.0.0' },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForStripe._stripe = stripe;
}

export { stripe };
export default stripe;
