import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../../../../server.js";



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
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })
            }
        })
    },
})