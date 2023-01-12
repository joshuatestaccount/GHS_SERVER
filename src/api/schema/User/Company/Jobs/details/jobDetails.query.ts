import { extendType, stringArg, list, nullable, nonNull, intArg } from 'nexus';
import { prisma } from '../../../../../../server.js';

export const jobDetialsQuery = extendType({
    type: "Query",
    definition(t) {
        t.list.field("getFindMyLocation", {
            type: "jobDetails",
            args: { location: stringArg() },
            resolve: async (_, { location }): Promise<any> => {
                return await prisma.jobDetails.findMany({
                    where: {
                        JobPost: {
                            status: "approved",
                        },
                        location: {
                            hasEvery: location
                        }
                    },

                })
            }
        })

        t.list.field("getSpecificJob", {
            type: "jobDetails",
            args: { category: stringArg(), jobType: list(stringArg()), workType: list(stringArg()), limit: nonNull(intArg()), offset: nonNull(intArg()) },
            resolve: async (_, {category, jobType, workType, limit, offset}): Promise<any> => {
               
                

                if(category) {
                    const catege = await prisma.jobDetails.findMany({
                        where: {
                            category,
                            JobPost: {
                                status: "approved"
                            }
                        },
                        take: limit,
                        skip: offset
                    })
                    return catege
                }


                if(jobType) {
                    const jbTyp = await prisma.jobDetails.findMany({
                        where: {
                            jobType :{
                                hasEvery: jobType
                            },
                            JobPost: {
                                status: "approved"
                            }
                        },
                        take: limit,
                        skip: offset
                    })
                    return jbTyp
                }

                if(workType){
                    const wrkType = await prisma.jobDetails.findMany({
                        where: {
                            workType: {
                                hasEvery: workType
                            },
                            JobPost: {
                                status: "approved"
                            }
                        },
                        take: limit,
                        skip: offset
                    })
                    return wrkType
                }
            }
        })

        t.list.field("getJobRelated", {
            type: "jobDetails",
            args: { category: nonNull(stringArg()), limit: nonNull(intArg()), offset: nonNull(intArg()) },
            resolve: async (_, { category, limit, offset}): Promise<any> => {
                return await prisma.jobDetails.findMany({
                    where: {
                        category,
                        JobPost :{ 
                            status: "approved"
                        }
                    },
                    take: limit,
                    skip: offset
                })
            }
        })

    }
})