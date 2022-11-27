import { inputObjectType, objectType } from 'nexus';
import { prisma } from '../../../../../server.js';



export const addressInput = inputObjectType({
    name: "AddressInput",
    definition(t) {
        t.string("city");
        t.string("province");
        t.string("zipcode");
        t.string("street");
    },
})

export const addressObjecte = objectType({
    name: "address",
    definition(t) {
        t.id("addressID");
        t.string("city");
        t.string("province");
        t.string("zipcode");
        t.string("street");
        t.list.field("profile", {
            type: "profile",
            resolve: async (parent): Promise<any> => {
                await prisma.address.findMany({
                    where: {
                        addressID: parent.addressID
                    }
                })
            }
        })
    },
})