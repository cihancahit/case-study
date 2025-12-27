import { getDb } from "./store";

export const courceRepo = {
    findById: (id) => {
        const db = getDb();
        return db.courses.find(course => course.id === id) || null;
    },
    list() {
        const db = getDb();
        return db.courses;
    },
};