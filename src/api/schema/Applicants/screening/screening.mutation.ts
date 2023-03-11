import { extendType, idArg, nonNull, stringArg } from 'nexus'
import { prisma } from '../../../../server.js'
import googleCalendar from '../../../helpers/calendar.js'
import { GESend, Recipient } from '../../../helpers/email.js'
import { format } from 'date-fns'


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
                            Profile: true,
                            JobPost: true
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
                            User: {
                                include: {
                                    Profile: true
                                }
                            },
                        }
                    })

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

                    const dateTime = await prisma.screening.create({
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


                    GESend(applicant.email, `Dear Mr./Ms./Mrs, ${applicant.Profile.lastname}, <br><br>Good day!<br><br>Thank you for applying for the <b>${applicant.JobPost.title}</b>.<br><br>We are pleased to inform you that your interview has been scheduled on ${format(new Date(start), "MMMM dd, yyyy h:mm:ss a")}-${format(new Date(end), "MMMM dd, yyyy h:mm:ss a")} with ${userInt.User.Profile.firstname} ${userInt.User.Profile.lastname} as the interviewer.<br><br> if your registed using your GMail account, kindly check your Google Calendar for the Google Meet link. Otherwise, kindly wait for further instruction from  ${userInt.User.Profile.firstname} ${userInt.User.Profile.lastname} regarding the meeting link.<br><br>We look forward to meeting with you.<br><br>Regards, <br><br> <b>Global Headstart Specialist Inc.</b>
                    `, `Interview Schedule for ${applicant.JobPost.title}`)


                    Recipient(userInt.User.email, `Dear Mr./Ms./Mrs. <b>${userInt.User.Profile.lastname}</b>,<br><br>Good day!<br><br>Your interview schedule with <b>${applicant.Profile.firstname} ${applicant.Profile.lastname}</b> will be on ${format(new Date(start), "MMMM dd, yyyy h:mm:ss a")}-${format(new Date(end), "MMMM dd, yyyy h:mm:ss a")}.<br><br>If you are using GMail for your employee account, kindly check your Google Calendar for the Google Meet link. Otherwise, kindly send email <b>${applicant.Profile.firstname} ${applicant.Profile.lastname}</b> an email via <b>${applicant.email}</b> regarding the meeting link.<br><br>Regards, <br><br> <b>Global Headstart Specialist Inc.</b>
                    `, "Interview Schedule")




                    return dateTime
                })
            }
        })
    },
})