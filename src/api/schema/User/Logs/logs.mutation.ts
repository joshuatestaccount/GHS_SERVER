import { extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../../../server.js";
import { Dates } from "../../../helpers/dateFormat.js";



export const logMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createLogs", {
            type: "logs",
            args: { userID: nonNull(idArg()) },
            resolve: async (_, { userID }): Promise<any> => {

                const users = await prisma.user.findUnique({
                    where: {
                        userID
                    },
                    include: {
                        Profile: true
                    }
                })
                return await prisma.logs.create({
                    data: {
                        title: "Logout",
                        createdAt: Dates,
                        modifiedBy: `${users.Profile.firstname} ${users.Profile.lastname}`,
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