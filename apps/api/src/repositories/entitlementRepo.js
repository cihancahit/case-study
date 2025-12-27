import { getDb } from "./store.js";

export const entitlementRepo = {
    findActive(userId, courseId) {
        const db = getDb();
        return db.entitlements.find(
            entitlement => 
                entitlement.userId === userId && 
                entitlement.courseId === courseId && 
                entitlement.status === 'ACTIVE'
        ) || null;
    },
    create(entitlement){
            const db = getDb();
            db.entitlements.push(entitlement);
            return entitlement; 
        },
    listByUSerId(userId) {
        const db = getDb();
        return db.entitlements.filter(entitlement => entitlement.userId === userId);
    }
};