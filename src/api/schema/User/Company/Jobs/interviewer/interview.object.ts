import { objectType } from "nexus";
import { prisma } from "../../../../../../server.js";



export const interviewerObject = objectType({
    name: "interviewer",
    definition(t) {
        t.id("interviewerID");
        t.list.field("applicants", {
            type: "application",
            resolve: async (parent): Promise<any> => {
                return await prisma.applicant.findMany({
                    where: {
                        interviewerID: parent.interviewerID
                    }
                })
            }
        })
        t.list.field("user", {
            type: "user",
            resolve: async (parent): Promise<any> => {
                return await prisma.interviewer.findMany({
                    where: {
                        interviewerID: parent.interviewerID
                    }
                })
            }
        })
        t.date("createdAt")
    },
})