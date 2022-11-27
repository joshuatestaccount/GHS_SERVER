import { extendType, idArg, intArg, nonNull, stringArg } from 'nexus'
import { prisma } from '../../../../server.js'



export const endorsementQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getEndorsementAll", {
            type: "endorsement",
            resolve: async (): Promise<any> => {
                return await prisma.endorsement.findMany()
            }
        })
        t.list.field("getEndorsementById", {
            type: "endorsement",
            args: { endorsementID: nonNull(idArg()) },
            resolve: async (_, { endorsementID }): Promise<any> => {
                return await prisma.endorsement.findMany({
                    where: {
                        endorsementID
                    }
                })
            }
        })
        t.list.field("getEndorsementSpecificStatus", {
            type: "endorsement",
            args: {
                status: nonNull(stringArg()), limit: nonNull(intArg()), order: "orderedBy", offset: nonNull(intArg())
            },
            resolve: async (_, { status, limit, order, offset }): Promise<any> => {
                return await prisma.endorsement.findMany({
                    where: {
                        Status: status,
                    },
                    take: limit,
                    skip: offset,
                    orderBy: {
                        createdAt: order
                    }
                })
            }
        })
        t.list.field("getEndorsmentByCSV", {
            type: "endorsement",
            args: { status: nonNull(stringArg()), start: nonNull(stringArg()), end: nonNull(stringArg()), order: "orderedBy" },
            resolve: async (_, { status, start, end, order }): Promise<any> => {
                return await prisma.$queryRawUnsafe(`SELECT * FROM PUBLIC."Endorsement" 
                where "Status" = '${status}' AND "createdAt" between '${start}'
                AND '${end}'
                ORDER by public."Endorsement"."createdAt" ${order}`)
            }
        })
    }
})