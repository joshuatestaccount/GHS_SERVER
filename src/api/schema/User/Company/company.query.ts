import { extendType, idArg, intArg, nonNull } from 'nexus';
import { prisma } from '../../../../server.js';



export const companyQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getAllCompany", {
            type: "company",
            resolve: async (): Promise<any> => {
                return await prisma.company.findMany()
            }
        })
        t.list.field("getEmployerCompany", {
            type: "company",
            args: { limit: nonNull(intArg()), offset: nonNull(intArg()) },
            resolve: async (): Promise<any> => {
                return await prisma.company.findMany({
                    where: {
                        User: {
                            some: {
                                role: "employer"
                            }
                        }
                    }
                })
            }
        })
        t.list.field("getEmployerCompanyGroup", {
            type: "countByGroup",
            resolve: async (): Promise<any> => {
                const company = await prisma.company.groupBy({
                    where: {
                        User: {
                            some: {
                                role: "employer"
                            }
                        }
                    },
                    by: ['createdAt'],
                    _count: {
                        companyID: true
                    }
                })
                return company.map(({_count, createdAt}) => {
                    return { _count: _count.companyID, createdAt: createdAt }
                })
            }
        })
        t.list.field("getCompanyPartner", {
            type: "company",
            resolve: async(): Promise<any> => {
                return await prisma.company.findMany({
                    where: {
                        User: {
                            some: {
                                role: "employer"
                            }
                        }
                    }
                })
            }
        })
        t.list.field("getCompanyById", {
            type: "company",
            args: { companyID: nonNull(idArg()) },
            resolve: async (_, { companyID }): Promise<any> => {
                return await prisma.company.findMany({
                    where: {
                        companyID
                    }
                })
            }
        })
    },
})