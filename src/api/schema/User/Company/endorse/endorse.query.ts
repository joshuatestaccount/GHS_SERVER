import { extendType } from "nexus";
import { prisma } from "../../../../../server.js";


export const endorQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getAllEndorse", {
            type: "endorse",
            resolve: async (): Promise<any> => {
                return await prisma.endorse.findMany()
            }
        })
    },
})