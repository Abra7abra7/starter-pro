import Stripe from 'stripe';

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? '',
  {
    apiVersion: '2025-01-27.acacia',
    appInfo: {
      name: 'Winery E-shop',
      version: '1.0.0'
    }
  }
);
