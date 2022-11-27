import { asNexusMethod, enumType, objectType } from "nexus";
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'
import { GraphQLEmailAddress, GraphQLDate, GraphQLPhoneNumber, GraphQLDateTime } from 'graphql-scalars'
import { prisma } from '../../../server.js'

export const uploadGQL = asNexusMethod(GraphQLUpload, "Upload")
export const emailGQL = asNexusMethod(GraphQLEmailAddress, "email")
export const dateGQL = asNexusMethod(GraphQLDate, "date")
export const phoneGQL = asNexusMethod(GraphQLPhoneNumber, "phone")

export const roleEnum = enumType({
    name: "roles",
    members: [ "administrator", "recruiter", "moderator", "manager" ]
})


export const roleASCDSC = enumType({
    name: "orderedBy",

    members: [ "asc", "desc" ]
})
export const userObject = objectType({
    name: "user",
    definition(t) {
        t.id("userID");
        t.email("email");
        t.string("role")
        t.date("createdAt");
        t.date("updatedAt");
        t.list.field("endorsement", {
            type: "endorsement",
            resolve: async (parent): Promise<any> => {
                return prisma.endorsement.findMany({
                    where: {
                        userID: parent.userID
                    }
                })
            }
        })
        t.list.field("profile", {
            type: "profile",
            resolve: async (parent): Promise<any> => {
                return await prisma.profile.findMany({
                    where: {
                        userID: parent.userID
                    }
                })
            }
        })
        t.list.field("company", {
            type: "company",
            resolve: async (parent): Promise<any> => {
                return await prisma.company.findMany({
                    where: {
                        User: {
                            some: {
                                userID: parent.userID
                            }
                        }
                    }
                })
            }
        })
        t.list.field("logs", {
            type: "logs",
            resolve: async (parent): Promise<any> => {
                return await prisma.logs.findMany({
                    where: {
                        User: {
                            some: {
                                userID: parent.userID
                            }
                        }
                    }
                })
            }
        })
        t.list.field("notification", {
            type: "notification",
            resolve: async (parent): Promise<any> => {
                return await prisma.notification.findMany({
                    where: {
                        userID: parent.userID
                    }
                })
            }
        })
    },
})

export const userToken = objectType({
    name: "token",
    definition(t) {
        t.string("token")
    }
})