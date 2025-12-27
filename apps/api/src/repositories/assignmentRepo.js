import { getDb } from "./store.js";

const ACTIVE_STATUSES = new Set(['ASSIGNED', 'IN_PROGRESS']);

export const assignmentRepo = {
    createAssignement(assignment) {
        const db = getDb();
        db.assignments.push(assignment);
        return assignment; 
    },
    findById(id) {
        const db = getDb();
        return db.assignments.find(assignment => assignment.id === id) || null;
    },
    listByInstructorId(instructorId) {
        const db = getDb();
        return db.assignments.filter(assignment => assignment.instructorId === instructorId);
    },
    listActiveByInstructorId(instructorId) {
        const db = getDb();
        return db.assignments.filter(
            assignment => 
                assignment.instructorId === instructorId && 
                ACTIVE_STATUSES.has(assignment.status)
        );
    },
    updateStatus(id, status) {
        const assignment = this.findById(id);
        if (!assignment) return null;
        assignment.status = status;
        assignment.updatedAt = new Date().toISOString();
        return assignment;
    },
    listByRequestId(requestId) {
        const db = getDb();
        return db.assignments.filter(assignment => assignment.requestId === requestId);
    }
};