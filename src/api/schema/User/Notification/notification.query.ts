import { extendType, idArg, nonNull } from 'nexus';
import { prisma } from '../../../../server.js';


export const notificationQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getNotificationByStatus", {
            type: "notification",
            resolve: async (): Promise<any> => {
                return await prisma.notification.findMany({
                    where: {
                        AND: {
                            JobPost: {
                                status: "inProgress"
                            },
                            notifiactionStatus: "unread"
                        }
                    }
                })
            }
        })
        t.list.field("getAllNotification", {
            type: "notification",
            resolve: async (): Promise<any> => {
                return await prisma.notification.findMany({
                    where: {
                        notifiactionStatus: "unread"
                    }
                })
            }
        })
        t.list.field("getNotificationID", {
            type: "notification",
            args: { notificationID: nonNull(idArg()) },
            resolve: async (_, { notificationID }): Promise<any> => {
                return await prisma.notification.findMany({
                    where: {
                        notificationID: notificationID
                    }
                })
            }
        })
    },
})