import { asNexusMethod, objectType } from 'nexus'
import { prisma } from '../../../../server.js';

import { GraphQLDateTime } from 'graphql-scalars';

export const logsObejct = objectType({
    name: "logs",
    definition(t) {
        t.id("logsID");
        t.string("title");
        t.string("modifiedBy");
        t.datetime("createdAt");
        t.list.field("users", {
            type: "user",
            resolve: async (parent): Promise<any> => {
                return await prisma.user.findMany({
                    where: {
                        Logs: {
                            some: {
                                logsID: parent.logsID
                            }
                        }
                    }
                })
            }
        })
    },
})