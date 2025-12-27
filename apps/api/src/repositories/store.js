import { seed } from "../data/seed.js";

const db = {
    accounts:[],
    instructorProfiles: [],
    courses: [],
    checkouts: [],
    paymentAttempts: [],
    entitlements: [],
    lessonRequests: [],
    assignments: [],
    notifications: [],
}

export function initStore() {
    db.accounts = [...seed.accounts];
    db.instructorProfiles = [...seed.instructorProfiles];
    db.courses = [...seed.courses];
    db.checkouts = [];
    db.paymentAttempts = [];
    db.entitlements = [];
    db.lessonRequests = [];
    db.assignments = [];
    db.notifications = [];
}

export function getDb() {
    return db;
}