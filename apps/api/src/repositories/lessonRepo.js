import { getDb } from "./store.js";

export const lessonRepo = {
    createRequest(reqObj){
        const db = getDb();
        db.lessonRequests.push(reqObj);
        return reqObj;
    },
    findRequestById(id){
        const db = getDb();
        return db.lessonRequests.find(r => r.id === id) || null;
    },
    updateRequeststatus(id, status){
        const r = this.findRequestById(id);
        if (!r) return null;
        r.status = status;
        r.updatedAt = new Date().toISOString();
        return r;
    },
    listByUserId(userId) {
        const db = getDb();
        return db.lessonRequests.filter(r => r.userId === userId);
    },
    updateRequestStatus(id, status) {
        const r = this.findRequestById(id);
        if (!r) return null;
        r.status = status;
        r.updatedAt = new Date().toISOString();
        return r;
    }
}