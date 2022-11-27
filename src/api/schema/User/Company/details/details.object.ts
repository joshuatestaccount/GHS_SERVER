import { objectType } from 'nexus';
import { prisma } from '../../../../../server.js';

export const companyDetailsObject = objectType({
    name: "company_details",
    definition(t) {
        t.id("companyDetailsID");
        t.list.field("location", {
            type: "address",
            resolve: async (parent): Promise<any> => {
                return await prisma.address.findMany({
                    where: {
                        companyDetailsID: parent.companyDetailsID
                    }
                })
            }
        })
        t.string("mission");
        t.string("vission");
        t.list.field("company", {
            type: "company",
            resolve: async (parent): Promise<any> => {
                return await prisma.company.findMany({
                    where: {
                        details: {
                            companyDetailsID: parent.companyDetailsID
                        }
                    }
                })
            }
        })
    },
})