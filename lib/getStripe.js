// lib/getStripe.js
import { loadStripe } from '@stripe/stripe-js';

let promesaStripe = null;

const getStripe = () => {
  if (!promesaStripe) {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!pk) {
      console.warn('Falta NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
      promesaStripe = Promise.resolve(null);
    } else {
      promesaStripe = loadStripe(pk);
    }
  }
  return promesaStripe;
};

export default getStripe;
