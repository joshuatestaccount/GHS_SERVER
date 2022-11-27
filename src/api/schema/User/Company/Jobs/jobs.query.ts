import { extendType, idArg, intArg, nonNull, stringArg } from 'nexus';
import { prisma } from '../../../../../server.js';


export const jobQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("jobQuery", {
            type: "JobPost",
            resolve: async (): Promise<any> => {
                return await prisma.jobPost.findMany()
            }
        })
        t.list.field("getJobPostById", {
            type: "JobPost",
            args: {
                jobPostID: nonNull(idArg())
            },
            resolve: async (_, { jobPostID }): Promise<any> => {
                return await prisma.jobPost.findMany({
                    where: {
                        jobPostID
                    }
                })
            }
        })

        t.list.field("getAllJobPost", {
            type: "JobPost",
            resolve: async (): Promise<any> => {
                return await prisma.jobPost.findMany({
                    where: {
                        status: "approved"
                    }
                })
            }
        })

        t.list.field("getJobPostSearch", {
            type: "JobPost",
            args: { search: nonNull(stringArg()) },
            resolve: async (_, { search }): Promise<any> => {
                return await prisma.jobPost.findMany({
                    where: {
                        status: "approved",
                        title: {
                            contains: search,
                            mode: "insensitive",

                        },
                        
                    },
                })
            }
        })
        t.list.field("getJobByStatus", {
            type: "JobPost",
            args: {
                status: nonNull(stringArg()), take: nonNull(intArg()), order: "orderedBy",
                offset: nonNull(intArg())
            },
            resolve: async (_, { status, take, order, offset }): Promise<any> => {
                return await prisma.$queryRawUnsafe(`SELECT * from public."JobPost"
                WHERE status = '${status}'
                ORDER by "JobPost"."createdAt" ${order}
                LIMIT ${take}
                OFFSET ${offset}
                `)
            }
        })
    },
})
