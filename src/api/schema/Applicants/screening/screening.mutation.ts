import { extendType, idArg, nonNull, stringArg } from 'nexus'
import { prisma } from '../../../../server.js'
import googleCalendar from '../../../helpers/calendar.js'



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
                            applicantID: true,
                            email: true
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

                    console.log(new Date(start).toISOString(), new Date(end).toISOString())
                     googleCalendar(start, end, applicant.email)


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