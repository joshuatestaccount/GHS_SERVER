import { GraphQLError } from 'graphql'
import Auth, { JwtPayload } from 'jsonwebtoken'
import { extendType, idArg, nonNull, stringArg } from 'nexus'
import { prisma, pubsub } from '../../../../server.js'
import { Dates } from '../../../helpers/dateFormat.js'

const { verify } = Auth


export const endorsementMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("updateEndorsement", {
            type: "endorsement",
            args: { endorsementID: nonNull(idArg()), Status: nonNull(stringArg()) },
            resolve: async (_, { endorsementID, Status }, { req }): Promise<any> => {
                return prisma.$transaction(async () => {
                    const token = req.cookies[ "ghs_access_token" ];
                    const { userID, role } = verify(token, "HeadStart") as JwtPayload
                    if (userID && role === "administrator" || "morderator" || "recruiter" || "manager") {

                        const user = await prisma.user.findUnique({
                            where: { userID },
                            include: {
                                Profile: true
                            }
                        })
                        const endorsement = await prisma.endorsement.update({
                            where: {
                                endorsementID
                            },
                            data: {
                                Status
                            }
                        })

                        await prisma.logs.create({
                            data: {
                                title: "Update Endorsement Status",
                                modifiedBy: `${user.Profile.firstname} ${user.Profile.lastname}`,
                                createdAt: Dates,
                                User: {
                                    connect: {
                                        userID
                                    }
                                }
                            }
                        })

                        return endorsement
                    }
                })

            }
        })
        t.field("deleteEndorsement", {
            type: "endorsement",
            args: { endorsementID: nonNull(idArg()) },
            resolve: async (_, { endorsementID }, { req }): Promise<any> => {
                const token = req.cookies[ "ghs_access_token" ];
                const { userID, role } = verify(token, "HeadStart") as JwtPayload
                if (userID && role === "administrator" || "morderator" || "manager") {

                    const user = await prisma.user.findUnique({
                        where: { userID },
                        include: {
                            Profile: true
                        }
                    })

                    const endorsement = await prisma.endorsement.delete({
                        where: {
                            endorsementID
                        }
                    })


                    await prisma.logs.create({
                        data: {
                            title: "Delete Endorsement",
                            modifiedBy: `${user.Profile.firstname} ${user.Profile.lastname}`,
                            createdAt: Dates,
                            User: {
                                connect: {
                                    userID
                                }
                            }
                        }
                    })
                }
            }
        })
        t.list.field("getEndorsmentByCSV", {
            type: "endorsement",
            args: { status: nonNull(stringArg()), start: nonNull(stringArg()), end: nonNull(stringArg()), order: "orderedBy" },
            resolve: async (_, { status, start, end, order, }): Promise<any> => {
                return await prisma.$queryRawUnsafe(`SELECT * FROM PUBLIC."Endorsement" 
                where "Status" = '${status}' AND "createdAt" between '${start}'
                AND '${end}'
                ORDER by public."Endorsement"."createdAt" ${order}
              `)
            }
        })
    },
})