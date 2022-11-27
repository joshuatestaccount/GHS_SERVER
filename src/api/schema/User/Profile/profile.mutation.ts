import { extendType, idArg, nonNull } from 'nexus';
import { prisma } from '../../../../server.js';


export const profileMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("updateProfile", {
            type: "profile",
            args: { Profile: "ProfileInput", profileID: nonNull(idArg()) },
            resolve: async (_, { Profile: { firstname, lastname, phone, birthday }, profileID }): Promise<any> => {
                return await prisma.profile.update({
                    where: {
                        profileID
                    },
                    data: {
                        firstname, lastname, phone, birthday
                    }
                })
            }
        })
    },
})