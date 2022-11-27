import { subscriptionField } from 'nexus'
import { prisma, pubsub } from '../../../../../server.js'

export const jobSubscription = subscriptionField("createAJobPostSubscriptions", {
    type: "JobPost",
    subscribe: async (): Promise<any> => {
        return await pubsub.asyncIterator("createJobPostSub")
    },
    resolve: async (payload): Promise<any> => {
        return await payload
    }
})