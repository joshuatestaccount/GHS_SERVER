import { GraphQLError } from 'graphql';
import Authorized, { JwtPayload } from 'jsonwebtoken';
import { extendType, idArg, nonNull } from 'nexus'
import { prisma, pubsub } from '../../../../../server.js'
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

                    const user = await prisma.user.findUnique({
                        where: { userID },
                        include: {
                            Profile: true
                        }
                    })
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
                                updatedAt:  new Date(Date.now()),
                                createdAt:  new Date(Date.now()),
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
                                title: "New Job Post",
                                createdAt:  new Date(Date.now()),
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

                        await prisma.logs.create({
                            data: {
                                title: "Create Job Post",
                                modifiedBy: `${user.Profile.firstname} ${user.Profile.lastname}`,
                                createdAt:  new Date(Date.now()),
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

                    return await prisma.$transaction(async () => {
                        const user = await prisma.user.findUnique({
                            where: { userID },
                            include: {
                                Profile: true
                            }
                        })

                        await prisma.logs.create({
                            data: {
                                title: "Create Job Post",
                                modifiedBy: `${user.Profile.firstname} ${user.Profile.lastname}`,
                                createdAt:  new Date(Date.now()),
                                User: {
                                    connect: {
                                        userID
                                    }
                                }
                            }
                        })

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
                                createdAt:  new Date(Date.now()),
                                updatedAt:  new Date(Date.now()),
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
                    })

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
                if (userID && role === "administrator" || "manager" || "moderator") {
                    return await prisma.$transaction(async () => {

                        const user = await prisma.user.findUnique({
                            where: { userID },
                            include: {
                                Profile: true
                            }
                        })


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



                        await prisma.logs.create({
                            data: {
                                title: "Update Job Post Status",
                                modifiedBy: `${user.Profile.firstname} ${user.Profile.lastname}`,
                                createdAt:  new Date(Date.now()),
                                User: {
                                    connect: {
                                        userID
                                    }
                                }
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

                    const user = await prisma.user.findUnique({
                        where: { userID },
                        include: {
                            Profile: true
                        }
                    })

                    const post = await prisma.jobPost.update({
                        data: {
                            description, qualification, responsibilities, title,
                            updatedAt:  new Date(Date.now()),
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
                    await prisma.logs.create({
                        data: {
                            title: "Update Job Post",
                            modifiedBy: `${user.Profile.firstname} ${user.Profile.lastname}`,
                            createdAt:  new Date(Date.now()),
                            User: {
                                connect: {
                                    userID
                                }
                            }
                        }
                    })

                    return post

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



                    const job = await prisma.jobPost.delete({
                        where: { jobPostID }, include: {
                            Notification: true
                        }
                    })

                    await prisma.notification.update({
                        data: {
                            notificationStatus: "read"
                        },
                        where: {
                            notificationID: job.notificationID
                        }
                    })



                }


            }
        })
    },
})