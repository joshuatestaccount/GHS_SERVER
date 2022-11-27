import { ApolloError } from 'apollo-server-core'
import Auth, { JwtPayload } from 'jsonwebtoken'
import { extendType, idArg, intArg, nonNull, stringArg } from 'nexus'
import { prisma, pubsub } from '../../../../server.js'
import { Dates } from '../../../helpers/dateFormat.js'

const { verify } = Auth


export const endorsementMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createEndorsement", {
            type: "endorsement",
            args: {
                userID: nonNull(idArg()),
                Profile: "ProfileInput", Address: "AddressInput",
                email: nonNull("EmailAddress")
            },
            resolve: async (_, { userID, email, Profile: { firstname, lastname, phone, birthday }, Address: { city, province, street, zipcode }, }, { req }): Promise<any> => {
                const findUser = await prisma.user.findUnique({
                    where: {
                        userID
                    }
                })
                if (!findUser.userID && !findUser.role) {
                    throw new ApolloError("Invalid information")
                }

                const token = req.cookies[ "ghs_access_token" ];
                const { userID: userdids, role } = verify(token, "HeadStart") as JwtPayload
                if (userID === userdids && role === "administrator" || "morderator" || "recruiter" || "manager") {
                    const endorsement = await prisma.endorsement.create({
                        data: {
                            Status: "Waiting",
                            email,
                            Profile: {
                                create: {
                                    firstname,
                                    lastname,
                                    phone,
                                    birthday,
                                    Address: {
                                        create: {
                                            province,
                                            city,
                                            street,
                                            zipcode
                                        }
                                    }
                                },
                            },
                            Company: {
                                connect: {
                                    companyID: findUser.companyID
                                }
                            },
                            createdAt: Dates,
                            updatedAt: Dates,
                            User: {
                                connect: {
                                    userID
                                }
                            }
                        }
                    })

                    pubsub.publish("createEndrosementSub", endorsement)
                    return endorsement
                }

            }
        })
        t.field("updateEndorsement", {
            type: "endorsement",
            args: { endorsementID: nonNull(idArg()), Status: nonNull(stringArg()) },
            resolve: async (_, { endorsementID, Status }, { req }): Promise<any> => {
                const token = req.cookies[ "ghs_access_token" ];
                const { userID, role } = verify(token, "HeadStart") as JwtPayload
                if (userID && role === "administrator" || "morderator" || "recruiter" || "manager") {
                    return await prisma.endorsement.update({
                        where: {
                            endorsementID
                        },
                        data: {
                            Status
                        }
                    })
                }

            }
        })
        t.field("deleteEndorsement", {
            type: "endorsement",
            args: { endorsementID: nonNull(idArg()) },
            resolve: async (_, { endorsementID }, { req }): Promise<any> => {
                const token = req.cookies[ "ghs_access_token" ];
                const { userID, role } = verify(token, "HeadStart") as JwtPayload
                if (userID && role === "administrator" || "morderator" || "manager") {
                    return await prisma.endorsement.delete({
                        where: {
                            endorsementID
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