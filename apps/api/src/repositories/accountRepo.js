import { getDb } from "./store";

export const accountRepo = {
    findById: (id) => {
        const db = getDb();
        return db.accounts.find(account => account.id === id) || null;
    },
    list() {
        const db = getDb();
        return db.accounts;
    },
    listByRole(role) {
        const db = getDb();
        return db.accounts.filter(account => account.role === role);
    },
};