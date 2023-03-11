import { extendType, idArg, nonNull, stringArg } from "nexus";
import { prisma } from "../../../../../server.js";
import { Dates } from "../../../../helpers/dateFormat.js";
import { GESend } from "../../../../helpers/email.js";



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


                    const endorsement = await prisma.endorsement.findUnique({
                        where: {
                            endorsementID
                        },
                        include: {
                            Applicant: true
                        }

                    })

                    const applicant = await prisma.applicant.findUnique({
                        where: {
                            applicantID: endorsement.Applicant[ 0 ].applicantID
                        },
                        include: {
                            JobPost: true,
                            Profile: true
                        }
                    })


                    const company = await prisma.company.findUnique({
                        where: {
                            companyID
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
                        },
                        include: {
                            Endorsement: {
                                include: {
                                    Applicant: {
                                        include: {
                                            Profile: true
                                        }
                                    },
                                    Company: true
                                }
                            }
                        }
                    })

                    await prisma.logs.create({
                        data: {
                            title: "Endorsed an Applicant",
                            modifiedBy: `${user.Profile.firstname} ${user.Profile.lastname}`,
                            createdAt: Dates,
                            User: {
                                connect: {
                                    userID
                                }
                            }
                        }
                    })

                    GESend(applicant.email, `Dear Mr./Ms.Mrs. <b>${applicant.Profile.lastname}</b><br><br>Good Day, ${applicant.Profile.lastname}!<br><br>We are pleased to inform you that your application's endorsement to <b>${endorse.Endorsement[ 0 ].Company.companyName}</b> has been approved. Please check the progress of your application on your account.<br><br>Kindly anticipate hearing from us soon regarding the status of your application and further instructions.<br><br>Regards, <br><br><b>Global Headstart Specialist Inc.</b>
                    ` , `Application for ${applicant.JobPost.title} is endorsed to ${company.companyName}`)
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
                        },
                        include: {
                            Endorsement: true,

                        }
                    })


                    const applicant = await prisma.endorsement.findMany({
                        where: {
                            Endorse: {
                                some: {
                                    endorseID
                                }
                            }
                        },
                        include: {
                            Applicant: {
                                include: {
                                    Profile: true
                                }
                            }
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



                    if (endorse.endorseStatus === "approved") {

                    }

                    if (endorse.endorseStatus === "rejected") {
                        GESend(applicant[ 0 ].Applicant[ 0 ].email, `Dear Mr./Ms.Mrs. <b>${applicant[ 0 ].Applicant[ 0 ].Profile.lastname}</b>`, ``)
                    }


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