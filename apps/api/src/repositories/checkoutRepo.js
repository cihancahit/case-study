import { getDb } from "./store";

export const checkoutRepo = {
    findById: (id) => {
        const db = getDb();
        return db.checkouts.find(checkout => checkout.id === id) || null;
    },
    list() {
        const db = getDb();
        return db.checkouts;
    },
    findByUserAndIdempotencyKey: (userId, idempotencyKey) => {
        const db = getDb();
        return db.checkouts.find(
            checkout => checkout.userId === userId && checkout.idempotencyKey === idempotencyKey
        ) || null;
    },
    updateStatus: (id, status) => {
        const o = this.findById(id);
        if (!o) return null;
        o.status = status;
        o.updatedAt = new Date().toISOString();
        return o;
    },
};