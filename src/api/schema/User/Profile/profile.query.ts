import { extendType, idArg, nonNull } from 'nexus'
import { prisma } from '../../../../server.js'



export const profileQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("profileQuery", {
            type: "profile",
            args: { userID: nonNull(idArg()) },
            resolve: async (_, { userID }): Promise<any> => {
                return await prisma.profile.findMany({
                    where: {
                        User: {
                            userID
                        }
                    }
                })
            }
        })
    }
})