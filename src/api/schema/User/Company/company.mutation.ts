import { extendType, idArg, nonNull } from 'nexus';
import { prisma } from '../../../../server.js';



export const companyMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("updateCompany", {
            type: "company",
            args: {
                companyID: nonNull(idArg()),
            },
            resolve: async (): Promise<any> => {
                return await prisma.company.update({
                    data: {},
                    where: {}
                })
            }
        })
        t.field("deleteCompany", {
            type: "company",
            args: {
                companyID: nonNull(idArg()),
            },
            resolve: async (_, { companyID }): Promise<any> => {
                return await prisma.company.delete({
                    where: {
                        companyID
                    }
                })
            }
        })
    },
})