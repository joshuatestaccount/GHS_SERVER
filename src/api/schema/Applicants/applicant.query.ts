import { extendType, idArg, intArg, nonNull, stringArg } from 'nexus'
import { prisma } from '../../../server.js'



export const applicantsQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getApplicationByStatus", {
            type: "application",
            args: { status: nonNull(stringArg()), limit: nonNull(intArg()), order: nonNull("orderedBy") },
            resolve: async (_, { status, limit, order }): Promise<any> => {
                return await prisma.applicant.findMany({
                    where: {
                        status: status as any
                    },
                    take: limit,
                    orderBy: {
                        createdAt: order
                    }
                })
            }
        })
        t.list.field("searchApplicantID", {
            type: "application",
            args: { search: nonNull(stringArg()), status: nonNull(stringArg()), limit: nonNull(intArg()), offset: nonNull(intArg()), order: nonNull("orderedBy") },
            resolve: async (_, { search, status, order, limit, offset }): Promise<any> => {
                return await prisma.applicant.findMany({
                    where: {
                        status: status as any,
                        id: {
                            contains: search,
                            mode: "insensitive"
                        },
                    },
                    take: limit,
                    skip: offset,
                    orderBy: {
                        createdAt: order
                    }
                })
            }
        })
        t.list.field("getApplicantByID", {
            type: "application",
            args: {
                applicationID: nonNull(idArg())
            },
            resolve: async (_, { applicationID }): Promise<any> => {
                return await prisma.applicant.findMany({
                    where: {
                        id: applicationID
                    }
                })
            }
        })
        t.list.field('getAllApplication', {
            type: "application",
            resolve: async (): Promise<any> => {
                return await prisma.applicant.findMany()
            }
        })
        t.list.field("getAllApplicationDateCount", {
            type: "countByGroup",
            resolve: async (): Promise<any> => {
                const app = await prisma.applicant.groupBy({
                    by: [ 'createdAt' ],
                    orderBy: {
                        createdAt: "asc"
                    },
                    _count: {
                        applicantID: true
                    }
                })
                return app.map(({ _count, createdAt }) => {
                    return { _count: _count.applicantID, createdAt: createdAt }
                })
            }
        })

        t.list.field("getApplicantByDWMY", {
            type: "countByGroup",

            args: { select: nonNull(stringArg()) },
            resolve: async (_, { select }): Promise<any> => {

                const app = await prisma.$queryRawUnsafe(`SELECT DATE_TRUNC('${select}', "createdAt" ) AS "createdAt", 
                COUNT("applicantID") AS count FROM public."Applicant"
                GROUP BY DATE_TRUNC('${select}', "createdAt")
                ORDER BY "createdAt" ASC
                `)

                return app.map(({ count, createdAt }) => {
                    return { _count: parseInt(count), createdAt: createdAt }
                })

            }
        })
    }
})