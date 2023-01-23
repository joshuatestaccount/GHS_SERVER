import { objectType } from "nexus";
import { prisma } from "../../../../server.js";




export const screeningObject = objectType({
    name: "screening",
    definition(t) {
        t.id("screeningID");
        t.list.field("applicantInterviewed", {
            type: "application",
            resolve: async (parent): Promise<any> => {
                return await prisma.applicant.findMany({
                    where: {
                        Screening: {
                            some :{
                                screeningID: parent.screeningID
                            }
                        }
                    }
                })
            }
        })
    },
})