import { objectType } from "nexus";
import { prisma } from "../../../../server.js";


export const companyObject = objectType({
    name: "company",
    definition(t) {
        t.id("companyID");
        t.string("companyName");
        t.list.field("comapnyDetails", {
            type: "company_details",
            resolve: async (parent): Promise<any> => {
                return await prisma.companyDetails.findMany({
                    where: {
                        companyID: parent.companyID
                    }
                })
            }
        })
        t.list.field("companyPost", {
            type: "JobPost",
            resolve: async (parent): Promise<any> => {
                return await prisma.jobPost.findMany({
                    where: {
                        companyID: parent.companyID
                    }
                })
            }
        })
        t.list.field("user", {
            type: "user",
            resolve: async (parent): Promise<any> => {
                return await prisma.user.findMany({
                    where: {
                        Company: {
                            companyID: parent.companyID
                        }
                    }
                })
            }
        })
    }
})