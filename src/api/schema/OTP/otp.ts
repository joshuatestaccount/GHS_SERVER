import { asNexusMethod, extendType, nonNull, objectType, stringArg } from "nexus";
import { prisma } from "../../../server.js";
import { GraphQLDateTime } from "graphql-scalars";
import { GraphQLError } from "graphql";
import { GESend } from "../../helpers/email.js";
import generateOTP from "../../helpers/otp.js";

export const DateGQL = asNexusMethod(GraphQLDateTime, 'datetime')


export const otpObject = objectType({
    name: "otp",
    definition(t) {
        t.id("OTPID");
        t.string("otp");
        t.datetime("createdAt")
        t.datetime("expiredAt")
    },
})


export const otpCRUD = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getAllOTP", {
            type: "otp",
            resolve: async (): Promise<any> => {
                return await prisma.oTP.findMany()
            }
        })
    },
})

export const otpMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createOTP", {
            type: "otp",
            args: { email: nonNull('EmailAddress') },
            resolve: async (_, { email }): Promise<any> => {
                const dates = new Date();
                const otps = await prisma.oTP.create({

                    data: {
                        otp: (await generateOTP(6)).toString(),
                        createdAt: new Date(Date.now()),
                        expiredAt: new Date(dates.getTime() + 3 * 60000)
                    }
                })

                GESend(`${email}`, `
                Good day! <br> <br> Your one-time password (OTP) is <b>${otps.otp}</b>. <br> It will expire in three (3) minutes. <br><br>Regards, <br>Global Headstart Specialist Inc.
                `, "Global Headstart Specialist OTP")

                return otps
            }
        })
        t.field("verifyOTP", {
            type: "otp",
            args: { otp: nonNull(stringArg()) },
            resolve: async (_, { otp }): Promise<any> => {
                const ottps = await prisma.oTP.findUnique({
                    where: {
                        otp
                    }
                })
                if (!ottps) throw new GraphQLError("OTP Mismatched")
                if (ottps.expiredAt.getTime() < new Date().getTime()) {
                    throw new GraphQLError("Your OTP is expired create a new one")
                }
                return ottps
            }
        })
    },
})