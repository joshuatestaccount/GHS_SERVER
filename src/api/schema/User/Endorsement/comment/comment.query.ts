import { extendInputType, extendType, idArg, nonNull } from "nexus";
import { prisma } from "../../../../../server.js";



export const commentQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getEndorsementCommnet", {
            type: "comment",
            args: { endorsementID: nonNull(idArg()) },
            resolve: async (_, { endorsementID }): Promise<any> => {
                return await prisma.comment.findMany({
                    where: {
                        endorsementID
                    }
                })
            }
        })
    },
})