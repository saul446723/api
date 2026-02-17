import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2026-01-28.clover",
  appInfo: {
    name: "api_online",
    url: "https://api_online.vercel.app",
  },
});