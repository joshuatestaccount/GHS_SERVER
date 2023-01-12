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

                return await prisma.$transaction(async () => {
                    const user = await prisma.user.findUnique({
                        where: { userID },
                        include: {
                            Profile: true
                        }
                    })

                    const endorse = await prisma.endorse.create({

                        data: {
                            endorseStatus: "waiting",
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

                    await prisma.logs.create({
                        data: {
                            title: "Create Endorse",
                            modifiedBy: `${user.Profile.firstname} ${user.Profile.lastname}`,
                            createdAt: Dates,
                            User: {
                                connect: {
                                    userID
                                }
                            }
                        }
                    })

                    return endorse
                })
            }
        })
        t.field("updateEndorse", {
            type: "endorse",
            args: { endorseStatus: nonNull(stringArg()), endorseID: nonNull(idArg()), userID: nonNull(idArg()) },
            resolve: async (_, { endorseStatus, endorseID, userID }, { req }): Promise<any> => {

                return await prisma.$transaction(async () => {

                    const user = await prisma.user.findUnique({
                        where: { userID },
                        include: {
                            Profile: true
                        }
                    })
                    const endorse = await prisma.endorse.update({
                        data: {
                            endorseStatus: endorseStatus as any
                        },
                        where: {
                            endorseID
                        }
                    })


                    await prisma.logs.create({
                        data: {
                            title: "Update Endorse",
                            modifiedBy: `${user.Profile.firstname} ${user.Profile.lastname}`,
                            createdAt: Dates,
                            User: {
                                connect: {
                                    userID
                                }
                            }
                        }
                    })


                    return endorse
                })
            }
        })
    },
})