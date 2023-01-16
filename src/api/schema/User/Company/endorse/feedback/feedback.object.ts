import { objectType } from 'nexus'
import { prisma } from '../../../../../../server.js';



export const feedbackObject = objectType({
    name: "feedback",
    definition(t) {
        t.id("feedbackID");
        t.string("feedback");
        t.date("createdAt");
        t.list.field("user", {
            type: "user",
            resolve: async (parent): Promise<any> => {
                return await prisma.user.findMany({
                    where: {
                        Feedback: {
                            feedbackID: parent.feedbackID
                        }
                    }
                })
            }
        })
        t.list.field("endorse", {
            type: "endorse",
            resolve: async (parent): Promise<any> => {
                return await prisma.endorse.findMany({
                    where: {
                        feedback: {
                            some: {
                                feedbackID: parent.feedbackID
                            }
                        }
                    }
                })
            }
        })
    },
})