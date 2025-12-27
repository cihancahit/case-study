

export const seed = {
    accounts: [
        // Users
    { id: "u1", name: "Demo User 1", role: "user" },
    { id: "u2", name: "Demo User 2", role: "user" },
        // Instructors
    { id: "i1", name: "Instructor One", role: "instructor" },
    { id: "i2", name: "Instructor Two", role: "instructor" },
        // admin
    { id: "a1", name: "Admin", role: "admin" },
    ],
    instructorProfiles: [
    { accountId: "i1", isAvailable: true, headline: "Full-Stack Instructor" },
    { accountId: "i2", isAvailable: true, headline: "Backend Instructor" },
    ],
    courses: [
        {id: "c1", title: "Learn JavaScript", description: "JavaScript course", instructorId: "i1",price: { amount: 19900, currency: "TRY" },status: "PUBLISHED"},
        {id: "c2", title: "Learn Node.js", description: "Node.js course", instructorId: "i2",price: { amount: 29900, currency: "TRY" },status: "PUBLISHED"},
        {id: "c3", title: "Learn Python", description: "Python course", instructorId: "i2",price: { amount: 25000, currency: "TRY" },status: "PUBLISHED"},
    ],
};