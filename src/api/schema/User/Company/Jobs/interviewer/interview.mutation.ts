import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../../../../../server.js";
import { Dates } from "../../../../../helpers/dateFormat.js";


export const interviewMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createInterviewer", {
            type: "interviewer",
            args: { userID: nonNull(idArg()), applicantID: nonNull(idArg()) },
            resolve: async (_, { userID, applicantID }): Promise<any> => {
                return await prisma.interviewer.create({
                    data: {
                        User: {
                            connect: {
                                userID
                            }
                        },
                        Applicant: {
                            connect: {
                                applicantID
                            }
                        },
                        createdAt: Dates
                    }
                })
            }
        })
    },
})