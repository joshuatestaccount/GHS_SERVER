import { extendType } from 'nexus'
import { prisma, pubsub } from '../../../server.js'

export const UserSubscriptions = extendType({
    type: "Subscription",
    definition(t) {
        t.field("UserSubscriptions", {
            type: "user",
            subscribe: async (): Promise<any> => {
                return pubsub.asyncIterator("createUser")
            },
            resolve: async (payload): Promise<any> => {
                return payload
            }
        })
    },
})