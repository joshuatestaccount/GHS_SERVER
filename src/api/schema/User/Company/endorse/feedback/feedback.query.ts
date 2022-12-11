import { extendType } from "nexus";
import { prisma } from "../../../../../../server.js";


export const feedbackQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getAllFeedback", {
            type: "feedback",
            resolve: async (): Promise<any> => {
                return await prisma.feedback.findMany()
            }
        })
    },
})