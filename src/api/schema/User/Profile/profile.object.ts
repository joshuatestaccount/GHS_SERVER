import { inputObjectType, objectType } from 'nexus'
import { prisma } from '../../../../server.js';


export const profileInputType = inputObjectType({
    name: "ProfileInput",
    definition(t) {
        t.string("firstname");
        t.string("lastname");
        t.phone("phone")
        t.date("birthday");
    },
})

export const profileObject = objectType({
    name: "profile",
    definition(t) {
        t.id("profileID");
        t.string("firstname");
        t.string("lastname");
        t.phone("phone");
        t.date("birthday");
        t.list.field('profileAddress', {
            type: "address",
            resolve: async (parent): Promise<any> => {
                return await prisma.address.findMany({
                    where: {
                        profileID: parent.profileID
                    }
                })
            }
        })
        t.list.field("user", {
            type: "user",
            resolve: async (parent): Promise<any> => {
                return await prisma.user.findMany({
                    where: {
                        Profile: {
                            profileID: parent.profileID
                        }
                    }
                })
            }
        })
    },
})