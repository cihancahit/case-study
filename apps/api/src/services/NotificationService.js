import { nanoid } from "nanoid";
import { notificationRepo } from "../repositories/notificationRepo";

export const NotificationService = {
    notify:(toAccountId, type, payload) => {
        const notification = {
            id: nanoid(),
            toAccountId,
            type,
            payload,
            status: "UNREAD",
            createdAt: new Date().toISOString(),
            readAt: null,
        };
        return notificationRepo.create(notification);
    }
};