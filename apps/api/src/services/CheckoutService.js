import { nanoid } from 'nanoid';

import { getPaymentProvider } from './PaymentProvider/index.js';
import { courseRepo } from '../repositories/courseRepo.js';
import { checkoutRepo } from '../repositories/checkoutRepo.js';
import { paymentRepo } from '../repositories/paymentRepo.js';
import { entitlementRepo } from '../repositories/entitlementRepo.js';
import { NotificationService } from './NotificationService.js';
import { E } from '../utils/appError.js';

function assertOwner(checkout, userId) {
  if (!checkout || checkout.userId !== userId) {
    throw E.notFound('CHECKOUT_NOT_FOUND', 'Checkout not found');
  }
}

function nowIsoString() {
  return new Date().toISOString();
}

export const CheckoutService = {
  async createCheckout({ userId, courseId, idempotencyKey }) {
    const course = courseRepo.findById(courseId);
    if (!course) {
      throw E.notFound('COURSE_NOT_FOUND', 'Course not found');
    }
    const existing = checkoutRepo.findByUserAndIdempotencyKey(userId, idempotencyKey);
    if (existing) {
      return {
        checkout: existing,
        provider: null,
        checkoutUrl: null,
        note: 'Idempotent replay: existing checkout returned',
      };
    }

    const checkout = checkoutRepo.create({
      id: nanoid(),
      userId,
      courseId,
      status: 'PAYMENT_PENDING',
      idempotencyKey,
      createdAt: nowIsoString(),
      updatedAt: nowIsoString(),
    });

    const provider = getPaymentProvider();
    const providerRes = await provider.createCheckoutSession({ checkoutId: checkout.id, course });

    paymentRepo.createAttempt({
      id: nanoid(),
      checkoutId: checkout.id,
      provider: provider.providerName,
      providerRef: providerRes.providerRef || null,
      status: 'INITIATED',
      createdAt: nowIsoString(),
      updatedAt: nowIsoString(),
    });
    return {
      checkout,
      provider: provider.providerName,
      checkoutUrl: providerRes.checkoutUrl,
    };
  },
  confirmSimulated({ userId, checkoutId, result }) {
    const checkout = checkoutRepo.findById(checkoutId);
    assertOwner(checkout, userId);
    const attempt = paymentRepo.findLatestByCheckoutId(checkoutId);
    if (!attempt) {
      throw E.notFound('PAYMENT_ATTEMPT_NOT_FOUND', 'Payment attempt not found for checkout');
    }

    if (checkout.status === 'COMPLETED') {
      return { checkout, entitlement: entitlementRepo.findActive(userId, checkout.courseId) };
    }

    if (result === 'fail') {
      checkoutRepo.updateStatus(checkoutId, 'FAILED');
      paymentRepo.updateStatus(attempt.id, 'FAILED');
      return { checkout: checkoutRepo.findById(checkoutId), entitlement: null };
    }

    paymentRepo.updateStatus(attempt.id, 'SUCCEEDED');
    checkoutRepo.updateStatus(checkoutId, 'COMPLETED');

    const entitlement = this.grantEntitlement({
      userId,
      courseId: checkout.courseId,
      checkoutId: checkout.id,
    });

    NotificationService.notify(userId, 'PAYMENT_SUCCEEDED', {
      checkoutId: checkout.id,
      courseId: checkout.courseId,
    });

    return { checkout: checkoutRepo.findById(checkoutId), entitlement };
  },
  async confirmStripeSuccess({ userId, checkoutId, sessionId }) {
    const checkout = checkoutRepo.findById(checkoutId);
    assertOwner(checkout, userId);
    if (checkout.status === 'COMPLETED') {
      return {
        checkout,
        entitlement: entitlementRepo.findActive(userId, checkout.courseId),
      };
    }
    const provider = getPaymentProvider();
    if (provider.providerName !== 'STRIPE') {
      throw E.badRequest('INVALID_PROVIDER', 'Payment provider is not STRIPE');
    }
    const { paid } = await provider.verifySessionPaid({ sessionId });
    if (!paid) {
      throw E.badRequest('PAYMENT_NOT_COMPLETED', 'Payment not completed yet');
    }
    const attempt = paymentRepo.findLatestByCheckoutId(checkoutId);
    if (!attempt) {
      throw E.notFound('PAYMENT_ATTEMPT_NOT_FOUND', 'Payment attempt not found for checkout');
    }
    paymentRepo.updateStatus(attempt.id, 'SUCCEEDED');
    checkoutRepo.updateStatus(checkoutId, 'COMPLETED');

    const entitlement = this.grantEntitlement({
      userId,
      courseId: checkout.courseId,
      checkoutId: checkout.id,
    });

    NotificationService.notify(userId, 'PAYMENT_SUCCEEDED', {
      checkoutId: checkout.id,
      courseId: checkout.courseId,
    });

    return { checkout: checkoutRepo.findById(checkoutId), entitlement };
  },
  grantEntitlement({ userId, courseId, checkoutId }) {
    const existing = entitlementRepo.findActive(userId, courseId);
    if (existing) {
      return existing;
    }
    const entitlement = entitlementRepo.create({
      id: nanoid(),
      userId,
      courseId,
      status: 'ACTIVE',
      grantedByCheckoutId: checkoutId,
      grantedAt: nowIsoString(),
    });
    return entitlement;
  },
};
