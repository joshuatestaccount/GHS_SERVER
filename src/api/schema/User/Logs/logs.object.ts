import { objectType } from 'nexus'
import { prisma } from '../../../../server.js';

export const logsObejct = objectType({
    name: "logs",
    definition(t) {
        t.id("logsID");
        t.string("title");
        t.string("modifiedBy");
        t.date("createdAt");
        t.date("updatedAt");
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