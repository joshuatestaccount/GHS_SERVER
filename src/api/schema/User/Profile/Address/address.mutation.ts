import { extendType, idArg, nonNull } from 'nexus'
import { prisma } from '../../../../../server.js'



export const addressMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.list.field("updateAddressByProfileID", {
            type: "address",
            args: { profileID: nonNull(idArg()), Address: "AddressInput" },
            resolve: async (_, { profileID, Address: { city, province, street, zipcode } }): Promise<any> => {
                return await prisma.address.update({
                    where: {
                        profileID
                    },
                    data: {
                        city, province, street, zipcode
                    }
                })
            }
        })
    },
})