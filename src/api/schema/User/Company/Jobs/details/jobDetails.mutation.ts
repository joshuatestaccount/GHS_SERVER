import { JobDetails } from '@prisma/client';
import { extendType, stringArg } from 'nexus';
import { prisma } from '../../../../../../server.js';



export const jobDetialsQuery = extendType({
    type: "Mutation",
    definition(t) {
        t.list.field("getDetailsFitlerAndSorting", {
            type: "jobDetails",
            args: {
                location: stringArg(), jobType: stringArg(), workType: stringArg(), category: stringArg()
            }
            ,
            resolve: async (_, { location, category, jobType, workType }): Promise<any> => {
                return await prisma.$queryRawUnsafe<JobDetails[]>(`
                SELECT * from public."JobDetails"
                INNER JOIN PUBLIC."JobPost" ON "JobPost"."jobPostID" = "JobDetails"."jobPostID" AND NOT "JobPost".status = 'inProgress'
                AND NOT "JobPost".status ='rejected'
                WHERE location =('{ ${location} }')
                     OR "jobType"=('{${jobType}} ') 
                     OR "workType"=('{${workType}}') 
                     OR category = '${category}' 
                `)

            }
        })
    }
})