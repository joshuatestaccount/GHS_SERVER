import { GraphQLError } from 'graphql'
import { extendType, idArg, nonNull, stringArg } from 'nexus'
import { prisma } from '../../../server.js'
import { AWSFileUpload, AWSVideoUpload } from '../../helpers/awsFileUpload.js'
import { Dates } from '../../helpers/dateFormat.js'
import { generateUUID } from '../../helpers/generateUUID.js'
import signature from 'jsonwebtoken'


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


                    return await prisma.applicant.update({
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
                        }
                    })
                }


                if (status === "rejected") {
                    return await prisma.applicant.update({
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
                        }
                    })
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