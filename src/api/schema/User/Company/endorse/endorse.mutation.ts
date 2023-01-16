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
        t.list.field("getEndorseByCSV", {
            type: "company",
            args: { userID: idArg(), status: nonNull(stringArg()), orders: nonNull("orderedBy"), end: nonNull(stringArg()), start: nonNull(stringArg()) },
            resolve: async (_, { userID, status, orders, end, start }): Promise<any> => {
                return await prisma.company.findMany({
                    where: {
                        Endorse: {
                            some: {
                                endorseStatus: status as any,
                                createdAt: {
                                    lte: new Date(end),
                                    gte: new Date(start)
                                }
                            },
                        },
                        User: {
                            some: {
                                userID
                            }
                        }
                    },
                    orderBy: {
                        createdAt: orders
                    }
                })
            }
        })
    },
})