import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../../../../../server.js";
import { Dates } from "../../../../../helpers/dateFormat.js";
import { GESend } from "../../../../../helpers/email.js";


export const interviewMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createInterviewer", {
            type: "interviewer",
            args: { userID: nonNull(idArg()), applicantID: nonNull(idArg()) },
            resolve: async (_, { userID, applicantID }): Promise<any> => {
                return await prisma.$transaction(async () => {

                    const app = await prisma.applicant.findUnique({
                        where: {
                            applicantID
                        },
                        include: {
                            Profile: true
                        }
                    })
                    const user = await prisma.user.findUnique({
                        where: { userID },
                        include: {
                            Profile: true
                        }
                    })

                    const interview = await prisma.interviewer.create({
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
                    await prisma.logs.create({
                        data: {
                            title: "Interviewed Applicant",
                            modifiedBy: `${user.Profile.firstname} ${user.Profile.lastname}`,
                            createdAt: Dates,
                            User: {
                                connect: {
                                    userID
                                }
                            }
                        }
                    })


                    GESend(app.email, `Dear Mr./Ms. ${app.Profile.lastname} 
                    Your application is being reviewed...
                    `, `Your Application is being Reviewed`)
                    return interview
                })
            }
        })
    },
})