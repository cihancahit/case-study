import { entitlementRepo } from '../repositories/entitlementRepo.js';
import courseRepo from '../repositories/courseRepo.js';

export const PurchaseService = {
  listMyPurchases(userId) {
    const entitlements = entitlementRepo.listByUSerId(userId);
    return entitlements.map((entitlement) => {
      const course = courseRepo.findById(entitlement.courseId);
      return {
        ...entitlement,
        course: course ?? null,
      };
    });
  },
};
