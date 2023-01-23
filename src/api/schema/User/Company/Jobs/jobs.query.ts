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
            args: { limit: nonNull(intArg()), offset: nonNull(intArg()), order: nonNull("orderedBy") },
            resolve: async (_, { limit, offset, order }): Promise<any> => {
                return await prisma.jobPost.findMany({
                    where: {
                        status: "approved"
                    },
                    take: limit,
                    skip: offset,
                    orderBy: {
                        createdAt: order
                    }
                })
            }
        })
        t.list.field("getAllCountJob", {
            type: "JobPost",
            resolve: async (): Promise<any> => {
                const job = await prisma.jobPost.findMany({
                    where: {
                        status: "approved"
                    }
                })

                return job
            }
        })

        t.list.field("getGroubyByJob", {
            type: "countByGroup",
            resolve: async (): Promise<any> => {
                const job = await prisma.jobPost.groupBy({
                    where: {
                        status: "approved",
                    },
                    by: [ "createdAt" ],
                    _count: {
                        jobPostID: true
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                })

                return job.map(({ _count, createdAt }) => {
                    return { _count: _count.jobPostID, createdAt: createdAt }
                })
            }
        })
        t.list.field("getJobPostDWMY", {
            type: "countByGroup",
            args: { select: nonNull(stringArg()) },
            resolve: async (_, { select }): Promise<any> => {
                const post = await prisma.$queryRawUnsafe(`SELECT DATE_TRUNC('${select}', "createdAt" ) AS "createdAt", 
                COUNT("jobPostID") AS count FROM public."JobPost"
                GROUP BY DATE_TRUNC('${select}', "createdAt")
                ORDER BY "createdAt" ASC
                `)

                return post.map(({ count, createdAt }) => {
                    return { _count: parseInt(count), createdAt: createdAt }
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
