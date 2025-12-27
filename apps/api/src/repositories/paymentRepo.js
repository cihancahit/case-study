import { getDb } from "./store.js";

export const paymentRepo = {
    createAttempt(attempt){
        const db = getDb();
        db.paymentAttempts.push(attempt);
        return attempt; 
    },
    findLatestByCheckoutId(checkoutId){
        const list = getDb().paymentAttempts.filter(p => p.checkoutId === checkoutId);
        if (list.length === 0) return null;
        return list[list.length - 1];
    },
    updateStatus(id, status){
        const o = this.findLatestById(id);
        if (!o) return null;
        o.status = status;
        o.updatedAt = new Date().toISOString();
        return o;
    }
};