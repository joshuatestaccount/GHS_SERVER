import { extendType, idArg, nonNull } from 'nexus';
import { prisma } from '../../../../../server.js';

export const addressQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getAddressQuery", {
            type: "address",
            resolve: async (): Promise<any> => {
                return await prisma.address.findMany()
            }
        })
      
    },
})