import { subscriptionField } from 'nexus'
import { pubsub } from '../../../../server.js'



export const endorsementMutation = subscriptionField("createEndorsementSub", {
    type: "endorsement",
    subscribe: async (): Promise<any> => {
        return await pubsub.asyncIterator("createEndrosementSub")
    },
    resolve: async (payload): Promise<any> => {
        return payload
    }
})