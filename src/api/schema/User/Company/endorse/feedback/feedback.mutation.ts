import { extendType, idArg, nonNull, stringArg } from 'nexus'
import { prisma } from '../../../../../../server.js'
import { Dates } from '../../../../../helpers/dateFormat.js'



export const feedbackMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createAFeedback", {
            type: "feedback",
            args: { feedback: nonNull(stringArg()), userID: nonNull(idArg()), endorseID: nonNull(idArg()) },
            resolve: async (_, { feedback, endorseID, userID }): Promise<any> => {
                return await prisma.feedback.create({
                    data: {
                        feedback,
                        Endorse: {
                            connect: {
                                endorseID
                            }
                        },
                        User: {
                            connect: {
                                userID
                            }
                        },
                        createdAt: Dates
                    }
                })
            }
        })
    },
})