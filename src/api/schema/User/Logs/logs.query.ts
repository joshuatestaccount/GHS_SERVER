import { extendType, idArg, intArg, nonNull } from 'nexus'
import { prisma } from '../../../../server.js'



export const LogsQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getUserLogs", {
            type: "logs",
            args: { userID: nonNull(idArg()), limit: nonNull(intArg()), offset: nonNull(intArg()), },
            resolve: async (_, { userID, limit, offset }): Promise<any> => {
                return await prisma.logs.findMany({
                    where: {
                        User: {
                            some: {
                                userID: userID
                            }
                        }
                    },
                    take: limit,
                    skip: offset
                })
            }
        })
    },
})