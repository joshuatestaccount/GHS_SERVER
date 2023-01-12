import { extendType, idArg, intArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../../../../server.js";


export const endorQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getAllEndorse", {
            type: "endorse",
            resolve: async (): Promise<any> => {
                return await prisma.endorse.findMany()
            }
        })
        t.list.field("getEndorseByStatus", {
            type: "endorse",
            args: { userID: nonNull(idArg()), status: nonNull(stringArg()), limit: nonNull(intArg()), order: nonNull("orderedBy"), offset: nonNull(intArg()) },
            resolve: async (_, { userID, status, limit, order, offset }): Promise<any> => {

                const user = await prisma.user.findUnique({
                    where: {
                        userID
                    }
                })

                const company = await prisma.company.findUnique({
                    where: {
                        companyID: user.companyID
                    }
                })
                return await prisma.endorse.findMany({
                    where: {
                        companyID: company.companyID,
                        endorseStatus: status as any,

                    },
                    take: limit,
                    skip: offset
                })
            }
        })
        t.list.field("getEndorseByID", {
            type: "endorse",
            args: { endorseID: nonNull(idArg()) },
            resolve: async (_, { endorseID }): Promise<any> => {
                return await prisma.endorse.findMany({
                    where: {
                        endorseID
                    }
                })
            }
        })
        t.list.field("getEndorsementFeedback", {
            type: "endorse",
            args: { endorsementID: nonNull(stringArg()) },
            resolve: async (_, { endorsementID }): Promise<any> => {
                return await prisma.endorse.findMany({
                    where: {
                        Endorsement: {
                            some: {
                                endorsementID
                            }
                        }
                    }
                })
            }
        })
    },
})