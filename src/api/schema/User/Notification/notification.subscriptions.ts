import { subscriptionField } from "nexus";
import { pubsub } from "../../../../server.js";


export const notificationSubs = subscriptionField("NotificationSubscriptions", {
    type: "notification",
    subscribe: async (): Promise<any> => {
        return pubsub.asyncIterator("createNotificationSub")
    },
    resolve: async (payload): Promise<any> => {
        return payload
    }
})