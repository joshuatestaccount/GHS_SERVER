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
    }
})