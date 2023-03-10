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
                            Profile: true,
                            JobPost: true
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
                        },
                        include: {
                            User: {
                                include: {
                                    Profile: true
                                }
                            }
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


                    GESend(app.email, `Dear Mr./Ms./Mrs. ${app.Profile.lastname}, Your application for the position of <b>${app.JobPost.title}</b> has been received and is currently being reviewed by our recruiters. You are now pending for an interview with Mr./Ms./Mrs. <b>${interview.User.Profile.firstname} ${interview.User.Profile.lastname}</b>, the recruiter who has been assigned to you.<br><br> Kindly wait for more instrunctions and updates on the interview schedule.<br><br>Regards,<br><br> <b>Global Headstart Specialist Inc.</b>
                    `, `Your Application is being Reviewed`)
                    return interview
                })
            }
        })
    },
})