import { GraphQLError } from 'graphql'
import { extendType, idArg, nonNull, stringArg } from 'nexus'
import { prisma } from '../../../server.js'
import { AWSFileUpload, AWSVideoUpload } from '../../helpers/awsFileUpload.js'
import { Dates } from '../../helpers/dateFormat.js'
import { generateUUID } from '../../helpers/generateUUID.js'
import signature from 'jsonwebtoken'
import { GESend } from '../../helpers/email.js'


const { sign } = signature

export const applicaitonMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createApplication", {
            type: "application",
            args: { jobPostID: nonNull(idArg()), email: nonNull("EmailAddress"), Profile: "ProfileInput", Address: "AddressInput", file: "Upload", video: 'Upload' },
            resolve: async (_, { jobPostID, email, Profile: { birthday, lastname, firstname, phone }, Address: { city, province, street, zipcode }, file, video }): Promise<any> => {
                const { createReadStream: fileReadStream, filename: filesName } = await file
                const { createReadStream: videoReadStream, filename: videoFileName } = await video

                return await prisma.$transaction(async () => {
                    const app = await prisma.applicant.create({
                        data: {
                            email,
                            id: generateUUID(new Date().getTime()),
                            createdAt: Dates,
                            updatedAt: Dates,
                            status: "waiting",
                            FileUpload: {
                                create: {
                                    file: await AWSFileUpload(filesName, fileReadStream),
                                    video: await AWSVideoUpload(videoFileName, videoReadStream),
                                    createdAt: new Date(Date.now()),
                                }
                            },

                            Profile: {
                                create: {
                                    firstname,
                                    lastname,
                                    phone,
                                    birthday,
                                    Address: {
                                        create: {
                                            city,
                                            province,
                                            street,
                                            zipcode,
                                        }
                                    }
                                }
                            },
                            JobPost: {
                                connect: {
                                    jobPostID
                                }
                            }
                        },
                        include: {
                            Profile: true
                        }
                    })


                    await prisma.notification.create({
                        data: {
                            title: "New Applicant",
                            createdAt: Dates,
                            notificationStatus: "unread",
                            Applicant: {
                                connect: {
                                    applicantID: app.applicantID
                                }
                            }
                        }
                    })

                    GESend(email, `
                    
                    Dear Mr/Ms ${app.Profile.lastname}
                    Your application for the position of [job title] at [company name] has been received. Our hiring team is currently reviewing all applications for this position. If you are one of the qualifying applicants to proceed to the interview process, our recruiters will contact you for your interview schedule. 

                    Kindly anticipate hearing from us soon regarding the status of your application.
                    
                    Thank you for your interest in our company, and we appreciate the time you invested in this application.
                    
                    
                    Regards,  
                    `, "Application Receieved")

                    return app
                })
            }
        })

        t.field("updateApplicantStatus", {
            type: "application",
            args: { applicantID: nonNull(idArg()), status: nonNull(stringArg()), userID: nonNull(idArg()) },
            resolve: async (_, { applicantID, status, userID }): Promise<any> => {

                const findUser = await prisma.user.findUnique({
                    where: {
                        userID
                    },
                    include: {
                        Profile: true
                    }
                })


                await prisma.logs.create({
                    data: {
                        title: "Applicant Status updated",
                        createdAt: Dates,
                        modifiedBy: `${findUser.Profile.firstname} ${findUser.Profile.lastname}`,
                        User: {
                            connect: {
                                userID: findUser.userID
                            }
                        }
                    }
                })
                if (status === "approved") {


                    const app = await prisma.applicant.update({
                        data: {
                            status: {
                                set: status as any
                            },
                            Endorsement: {
                                create: {
                                    createdAt: Dates,
                                    updatedAt: Dates,
                                    Status: "Waiting",
                                    Company: {
                                        connect: {
                                            companyID: findUser.companyID
                                        }
                                    },
                                    User: {
                                        connect: {
                                            userID
                                        }
                                    }
                                }
                            },
                            Notification: {
                                update: {
                                    notificationStatus: "read"
                                }
                            }
                        },
                        where: {
                            applicantID
                        },
                        include: {
                            Profile: true
                        }
                    })

                    GESend(app.email, ` Dear Mr./Ms. ${app.Profile.lastname} 
                    Congratulations!

                    We are pleased to inform you that your application for the [job title] position at [company name] has been approved. Our recruitment team will contact you for further details and instructions.
                    
                    We appreciate your interest in working with us and look forward to working with you soon.
                    
                    
                    Regards, 
                    `, "Application Approved")

                    GESend(app.email, `Dear Mr./Ms. ${app.Profile.lastname}  We inform you that your application has been approved for endorsement by other companies. Please check your application status on your account.

                    Kindly anticipate hearing from us soon regarding the status of your application and further instructions.
                    
                    
                    Regards, 
                    `, "Endorsement")

                    return app


                }


                if (status === "rejected") {
                    const app = await prisma.applicant.update({
                        data: {
                            status: {
                                set: status as any
                            },
                            Notification: {
                                update: {
                                    notificationStatus: "read"
                                }
                            }
                        },
                        where: {
                            applicantID
                        },
                        include: {
                            Profile: true
                        }
                    })

                    GESend(app.email, `We carefully and thoroughly evaluated a significant number of applications; unfortunately, we won’t be able to invite you to the next stage of the hiring process at this time. Despite your impressive resume, we have decided to move forward with a candidate whose qualifications are better suited to this particular position.

                    Please be informed that you will not be able to apply for another position for the next thirty (30) days. 
                    
                    Once again, thank you so much for taking the time to apply to our company. We wish you the best of luck and much success in your future endeavors.
                    
                    
                    Regards, 
                    .`, "Applicantion Rejected")


                    return app
                }
            }
        })
        t.field("viewMyApplication", {
            type: "token",
            args: { id: nonNull(stringArg()), email: nonNull("EmailAddress") },
            resolve: async (_, { email, id }, { res }): Promise<any> => {

                const findId = await prisma.applicant.findUnique({
                    where: {
                        id
                    }
                })

                if (!findId) throw new GraphQLError("Applicant No. is invalid")

                const token = sign({ applicantID: findId.id }, "HeadStart", {
                    algorithm: "HS512",
                    expiresIn: "1d",
                    noTimestamp: false
                })

                const app = await prisma.applicant.findFirst({
                    where: {
                        AND: {
                            id: findId.id,
                            email: {
                                equals: email
                            }
                        }
                    }
                })


                res.cookie("ghs_access_applicant", token, {
                    httpOnly: false,
                    sameSite: "none",
                    secure: true
                })

                if (!app) throw new GraphQLError("Invalid Email Address")

                return { token }
            }
        })

        t.list.field("generateApplicantCSV", {
            type: "application",
            args: { status: nonNull(stringArg()), start: nonNull(stringArg()), end: nonNull(stringArg()), order: nonNull(stringArg()) },
            resolve: async (_, { status, start, end, order }): Promise<any> => {
                return await prisma.$queryRawUnsafe(`SELECT * FROM PUBLIC."Applicant" 
                where "status" = '${status}' AND "createdAt" between '${start}' AND '${end}'
                ORDER by public."Applicant"."createdAt" ${order}`)
            }
        })
    },
})  