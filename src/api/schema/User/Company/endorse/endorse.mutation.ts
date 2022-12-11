import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../../../../server.js";
import { Dates } from "../../../../helpers/dateFormat.js";



export const endorseMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createEndorse", {
            type: "endorse",
            args: { endorsementID: nonNull(idArg()), companyID: nonNull(idArg()), userID: nonNull(idArg()) },
            resolve: async (_, { companyID, endorsementID, userID }): Promise<any> => {
                return await prisma.endorse.create({
                    data: {

                        Company: {
                            connect: {
                                companyID
                            }
                        },
                        Endorsement: {
                            connect: {
                                endorsementID
                            }
                        },
                        createdAt: Dates,
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })
            }
        })
        t.field("updateEndorse", {
            type: "endorse",
            args: { endorseStatus: nonNull(stringArg()), endorseID: nonNull(idArg()) },
            resolve: async (_, { endorseStatus, endorseID }, { req }): Promise<any> => {
                return await prisma.endorse.update({
                    data: {
                        endorseStatus: endorseStatus as any
                    },
                    where: {
                        endorseID
                    }
                })
            }
        })
    },
})