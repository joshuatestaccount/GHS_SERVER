import { extendType, idArg, nonNull, stringArg } from 'nexus'
import { prisma } from '../../../../server.js'
import googleCalendar from '../../../helpers/calendar.js'
import { Recipient } from '../../../helpers/email.js'



export const screeningMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createScreening", {
            type: "screening",
            args: { applicantID: nonNull(idArg()), start: nonNull(stringArg()), end: nonNull(stringArg()), userID: nonNull(idArg()) },
            resolve: async (_, { applicantID, start, end, userID }): Promise<any> => {

                return await prisma.$transaction(async () => {
                    const applicant = await prisma.applicant.findUnique({
                        where: {
                            applicantID,
                        },
                        select: {
                            id: true,
                            applicantID: true,
                            email: true,
                            interviewer: true,
                            Profile: true
                        }
                    })

                    const user = await prisma.user.findUnique({
                        where: {
                            userID
                        },
                        include: {
                            Profile: true
                        }
                    })

                    const userInt = await prisma.interviewer.findUnique({
                        where: { interviewerID: applicant.interviewer.interviewerID },
                        include: {
                            User: true,
                        }
                    })

                    console.log(new Date(start).toISOString(), new Date(end).toISOString())
                    googleCalendar(start, end, applicant.email)

                    Recipient(userInt.User.email, `Here is the interview link of ${applicant.Profile.firstname} ${applicant.Profile.lastname} - ${applicant.id} scheduled on ${start}-${end}`, "Applicant Interview link")

                    await prisma.logs.create({
                        data: {
                            createdAt: new Date(Date.now()),
                            modifiedBy: `${user.Profile.firstname} ${user.Profile.lastname}`,
                            title: "Create Interview Link",
                            User: {
                                connect: {
                                    userID
                                }
                            }
                        }
                    })

                    return await prisma.screening.create({
                        data: {
                            DateTime: new Date(Date.now()),
                            Applicant: {
                                connect: {
                                    applicantID: applicant.applicantID
                                }
                            },
                            User: {
                                connect: {
                                    userID
                                }
                            }
                        }
                    })
                })
            }
        })
    },
})