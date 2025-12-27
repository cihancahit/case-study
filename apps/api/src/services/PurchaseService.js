import { entitilementRepo } from '../repositories/entitlementRepo.js';
import courceRepo from '../repositories/courseRepo.js';

export const PurchaseService = {
  listMyPurchases(userId) {
    const entitlements = entitilementRepo.listByUSerId(userId);
    return entitlements.map((entitlement) => {
      const course = courceRepo.findById(entitlement.courseId);
      return {
        ...entitlement,
        course: course ?? null,
      };
    });
  },
};
