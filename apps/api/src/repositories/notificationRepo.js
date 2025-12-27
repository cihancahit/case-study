import { getDb } from "./store.js";

export const notificationRepo = {
    create(notification) {
        const db = getDb();
        db.notifications.push(notification);
        return notification; 
    },
    listByToAccountId(accountId) {
        const db = getDb();
        return db.notifications.filter(notification => notification.toAccountId === accountId);
    },
    findById(id) {
        const db = getDb();
        return db.notifications.find(notification => notification.id === id) || null;
    },
    markRead(id,readAtIso){
        const n = this.findById(id);
        if (!n) return null;
        n.status = "READ";
        n.readAt = readAtIso;
        return n;
    }
}