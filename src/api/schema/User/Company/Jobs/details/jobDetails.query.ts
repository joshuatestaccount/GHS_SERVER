import { extendType, stringArg, list, nullable, nonNull } from 'nexus';
import { prisma } from '../../../../../../server.js';

export const jobDetialsQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getFindMyLocation", {
            type: "jobDetails",
            args: { location: stringArg() },
            resolve: async (_, { location }): Promise<any> => {
                return await prisma.jobDetails.findMany({
                    where: {
                        JobPost: {
                            status: "approved",
                        },
                        location: {
                            hasEvery: location
                        }
                    },

                })
            }
        })

    }
})