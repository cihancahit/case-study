import { fa } from 'zod/locales';

export const SimulatedProvider = {
  providerNaame: 'SIMULATED',

  async createCheckoutSession({ checkoutId }) {
    return { checkoutUrl: null, providerRef: `simulated_${checkoutId}` };
  },

  async verifySessionPaid() {
    return { paid: false };
  },
};
