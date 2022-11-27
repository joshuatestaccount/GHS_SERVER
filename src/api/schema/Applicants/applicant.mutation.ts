import { ApolloError } from 'apollo-server-core'
import { extendType, idArg, intArg, list, nonNull, stringArg } from 'nexus'
import { prisma } from '../../../server.js'
import { AWSFileUpload, AWSVideoUpload } from '../../helpers/awsFileUpload.js'
import { Dates } from '../../helpers/dateFormat.js'
import { generateUUID } from '../../helpers/generateUUID.js'

export const applicaitonMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createApplication", {
            type: "application",
            args: { jobPostID: nonNull(idArg()), email: nonNull("EmailAddress"), Profile: "ProfileInput", Address: "AddressInput", file: "Upload", video: 'Upload' },
            resolve: async (_, { jobPostID, email, Profile: { birthday, lastname, firstname, phone }, Address: { city, province, street, zipcode }, file, video }): Promise<any> => {
                const { createReadStream: fileReadStream, filename: filesName } = await file
                const { createReadStream: videoReadStream, filename: videoFileName } = await video

                return await prisma.applicant.create({
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
            }
        })

        t.field("updateApplicantStatus", {
            type: "application",
            args: { applicantID: nonNull(idArg()), status: nonNull(stringArg()) },
            resolve: async (_, { applicantID, status }): Promise<any> => {
                return await prisma.applicant.update({
                    data: {
                        status: {
                            set: status as any
                        }
                    },
                    where: {
                        applicantID
                    }
                })
            }
        })
        t.field("viewMyApplication", {
            type: "application",
            args: { id: nonNull(stringArg()), email: "EmailAddress" },
            resolve: async (_, { email, id }): Promise<any> => {
                const user = await prisma.user.findMany({
                    where: {
                        email
                    }
                })

                const findId = await prisma.applicant.findFirst({
                    where: {
                        id
                    }
                })
                if (!user) throw new ApolloError("No email existing");
                if (!findId.id) throw new ApolloError("Invalid credentials");

                return await prisma.applicant.findFirst({
                    where: {
                        AND: {
                            id,
                            email: {
                                equals: email
                            }
                        }
                    }
                })
            }
        })
        t.field("generateApplicantCSV", {
            type: "application",
            args: { status: nonNull(stringArg()), start: nonNull(stringArg()), end: nonNull(stringArg()), limit: nonNull(intArg()), order: nonNull("orderedBy") },
            resolve: async (_, { status, start, end, limit, order }): Promise<any> => {
                return await prisma.$queryRawUnsafe(`SELECT * FROM PUBLIC."Applicant" 
                where "status" = ${status} AND "createdAt" between ${start}
                ORDER by public."Applicant"."createdAt" ${order}
                AND  ${end}
                limit ${limit}`)
            }
        })
    },
})  