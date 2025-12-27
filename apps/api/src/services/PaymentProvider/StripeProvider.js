import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const StripeProvider = {
  providerName: 'STRIPE',

  async createCheckoutSession({ checkoutId, course }) {
    const successUrl = process.env.STRIPE_SUCCESS_URL.replace('{CHECKOUT_ID}', checkoutId).replace(
      '{CHECKOUT_SESSION_ID}',
      '{CHECKOUT_SESSION_ID}'
    );

    const cancelUrl = process.env.STRIPE_CANCEL_URL;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: course.price.currency.toLowerCase(),
            product_data: { name: course.title },
            unit_amount: course.price.amount,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { checkoutId },
    });
    return { checkoutUrl: session.url, providerRef: session.id };
  },
  async verifySessionPaid({ sessionId }) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid';
    return { paid, session };
  },
};
