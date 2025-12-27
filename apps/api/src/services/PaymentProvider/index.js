import { StripeProvider } from './StripeProvider.js';
import { SimulatedProvider } from './SimulatedProvider.js';

export function getPaymentProvider() {
  const provider = (process.env.PAYMENT_PROVIDER || 'simulated').toLowerCase();
  if (provider === 'stripe') return StripeProvider;
  return SimulatedProvider;
}
