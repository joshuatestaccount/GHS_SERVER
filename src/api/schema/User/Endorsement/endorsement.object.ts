import { objectType } from 'nexus'
import { prisma } from '../../../../server.js';



export const endorsementObject = objectType({
    name: "endorsement",
    definition(t) {
        t.id('endorsementID');
        t.string("Status");
        t.date("createdAt");
        t.date("updatedAt");
        t.list.field("applicants", {
            type: "application",
            resolve: async (parent): Promise<any> => {
                return await prisma.applicant.findMany({
                    where: {
                        endorsementID: parent.endorsementID
                    }
                })
            }
        })
        t.list.field("endorsementComment", {
            type: "comment",
            resolve: async (parent): Promise<any> => {
                return await prisma.comment.findMany({
                    where: {
                        endorsementID: parent.endorsementID
                    }
                })
            }
        })
        t.list.field("endorse", {
            type: "endorse",
            resolve: async (parent): Promise<any> => {
                return await prisma.endorse.findMany({
                    where: {
                         Endorsement: {
                            some: {
                                endorsementID: parent.endorsementID
                            }
                         }
                    }
                })
            }
        })
        t.list.field("endorseBy", {
            type: "user",
            resolve: async (parent): Promise<any> => {
                return await prisma.user.findMany({
                    where: {
                        Endorsement: {
                            some: {
                                endorsementID: parent.endorsementID
                            }
                        }
                    }
                })
            }
        })
    }
})