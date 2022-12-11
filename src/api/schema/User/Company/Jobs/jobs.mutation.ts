import { GraphQLError } from 'graphql';
import Authorized, { JwtPayload } from 'jsonwebtoken';
import { extendType, idArg, nonNull } from 'nexus'
import { prisma, pubsub } from '../../../../../server.js'
import { Dates } from '../../../../helpers/dateFormat.js';
const { verify } = Authorized

export const jobMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createAJobForRecruiter", {
            type: "JobPost",
            args: { userID: nonNull(idArg()), JobPost: "JobPostInput", JobDetails: "jobDetailsInput" },
            resolve: async (_, { userID, JobPost: { description, qualification, responsibilities, title }, JobDetails: { jobType, salary, location, category, workType } }, { req }): Promise<any> => {
                const token = req.cookies[ "ghs_access_token" ];
                const { role } = verify(token, "HeadStart") as JwtPayload
                if (userID && role === "recruiter") {
                    return await prisma.$transaction(async () => {
                        const adminID = await prisma.user.findUnique({
                            where: {
                                userID
                            },
                            include: {
                                Company: true
                            }
                        })
                        const jobPost = await prisma.jobPost.create({
                            data: {
                                title,
                                description,
                                qualification,
                                responsibilities,
                                status: "inProgress",
                                updatedAt: Dates,
                                createdAt: Dates,
                                Company: {
                                    connect: {
                                        companyID: adminID.companyID
                                    }
                                },
                                User: {
                                    connect: {
                                        userID
                                    }
                                },
                                details: {
                                    create: {
                                        salary,
                                        jobType,
                                        location,
                                        category, workType
                                    }
                                },

                            }
                        })
                        const notifSub = await prisma.notification.create({
                            data: {

                                createdAt: Dates,
                                JobPost: {
                                    connect: {
                                        jobPostID: jobPost.jobPostID
                                    }
                                },
                                User: {
                                    connect: {
                                        userID
                                    }
                                }
                            }
                        })
                        pubsub.publish("createJobPostSub", jobPost)
                        pubsub.publish("createNotificationSub", notifSub)
                        return jobPost
                    })
                } else {
                    throw new GraphQLError("Your are required to sign in.")
                }

            }
        })

        t.field("createAJobForAMM", {
            type: "JobPost",
            args: {
                userID: nonNull(idArg()), JobPost: "JobPostInput", JobDetails: "jobDetailsInput",
            },
            resolve: async (_, { userID, JobPost: { title, description, qualification, responsibilities }, JobDetails: { location, salary, category, workType, jobType } }, { req }): Promise<any> => {
                const token = req.cookies[ "ghs_access_token" ];
                const { userID: userids, role } = verify(token, "HeadStart") as JwtPayload
                if (userID === userids && role === "administrator" || "moderator") {
                    const adminID = await prisma.user.findUnique({
                        where: {
                            userID
                        },
                        include: {
                            Company: true
                        }
                    })
                    const AMMPost = await prisma.jobPost.create({
                        data: {
                            title,
                            description,
                            qualification,
                            responsibilities,
                            status: "approved",
                            createdAt: Dates,
                            updatedAt: Dates,
                            Company: {
                                connect: {
                                    companyID: adminID.companyID
                                }
                            },
                            User: {
                                connect: {
                                    userID
                                }
                            },
                            details: {
                                create: {
                                    salary,
                                    jobType,
                                    location,
                                    category,
                                    workType
                                }
                            }
                        }
                    })
                    pubsub.publish("createJobPostSub", AMMPost)

                    return AMMPost
                } else {
                    throw new GraphQLError("Your are required to sign in.")
                }

            }
        })
        t.field("updateJobPostStatus", {
            type: "JobPost",
            args: { jobPostID: nonNull(idArg()), status: "jobStatus" },
            resolve: async (_, { jobPostID, status }, { req }): Promise<any> => {
                const token = req.cookies[ "ghs_access_token" ];
                const { userID, role } = verify(token, "HeadStart") as JwtPayload
                if (userID && role === "administrator") {
                    return await prisma.$transaction(async () => {
                        const post = await prisma.jobPost.update({
                            data: {
                                status
                            },
                            where: {
                                jobPostID
                            },
                            include: {
                                Notification: true
                            }
                        })

                        await prisma.notification.update({
                            data: {
                                notificationStatus: "read"
                            },
                            where: {
                                notificationID: post.notificationID
                            }
                        })

                        return post
                    })
                }

            }
        })
        t.field("updateJobPost", {
            type: "JobPost",
            args: {
                jobPostID: nonNull(idArg()), JobPost: "JobPostInput", JobDetails: "jobDetailsInput"
            },
            resolve: async (_, { jobPostID, JobPost: { description, qualification, responsibilities, title }, JobDetails: {
                jobType, location, salary, category, workType
            } }, { req }): Promise<any> => {
                const token = req.cookies[ "ghs_access_token" ];
                const { userID, role } = verify(token, "HeadStart") as JwtPayload
                if (userID && role === "administrator" || "recruiter") {
                    return await prisma.jobPost.update({
                        data: {
                            description, qualification, responsibilities, title,
                            updatedAt: Dates,
                            details: {
                                update: {
                                    jobType, location, salary, category, workType
                                }
                            }
                        },
                        where: {
                            jobPostID
                        }
                    })
                }

            }
        })
        t.field("deleteJobPost", {
            type: "JobPost",
            args: { jobPostID: nonNull(idArg()) },
            resolve: async (_, { jobPostID }, { req }): Promise<any> => {
                const token = req.cookies[ "ghs_access_token" ];
                const { userID, role } = verify(token, "HeadStart") as JwtPayload
                if (userID && role === "administrator" || "manager" || "moderator") {
                    return await prisma.jobPost.delete({
                        where: { jobPostID }
                    })
                }


            }
        })
    },
})