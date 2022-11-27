import { objectType } from 'nexus'
import { prisma } from '../../../../server.js';

export const notificationObject = objectType({
    name: "notification",
    definition(t) {
        t.id("notificationID");
        t.string("notificationStatus");
        t.date("createdAt");
        t.list.field("user", {
            type: "user",
            resolve: async (parent): Promise<any> => {
                return await prisma.user.findMany({
                    where: {
                        Notification: {
                            some: {
                                notificationID: parent.notificationID
                            }
                        }
                    }
                })
            }
        })
        t.list.field("notificationJob", {
            type: "JobPost",
            resolve: async (parent): Promise<any> => {
                return await prisma.jobPost.findMany({
                    where: {
                        notificationID: parent.notificationID
                    }
                })
            }
        })
    },
})