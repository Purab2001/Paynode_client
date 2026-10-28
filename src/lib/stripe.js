import { loadStripe } from "@stripe/stripe-js";

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

/** Only the admin Payroll chunk imports this, so Stripe.js is never fetched for other roles. */
export const stripePromise = key ? loadStripe(key) : null;
