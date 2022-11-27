import { enumType, inputObjectType, objectType } from 'nexus';
import { prisma } from '../../../../../server.js';

export const JobPostInput = inputObjectType({
    name: "JobPostInput",
    definition(t) {
        t.string("title");
        t.string("description");
        t.string("qualification");
        t.string("responsibilities");
    }
})


export const filterOrderBy = enumType({
    name: "FilterOderBy",
    members: [ 'desc', 'asc' ]
})


export const JobStatus = enumType({
    name: "jobStatus",
    members: [ "approved", "rejected" ]
})
export const jobObject = objectType({
    name: "JobPost",
    definition(t) {
        t.id("jobPostID");
        t.string("title");
        t.string("description");
        t.string("qualification");
        t.string("responsibilities");
        t.string("status");
        t.date("createdAt");
        t.date("updatedAt");
        t.list.field("users", {
            type: "user",
            resolve: async (parent): Promise<any> => {
                return await prisma.user.findMany({
                    where: {
                        JobPost: {
                            some: {
                                jobPostID: parent.jobPostID
                            }
                        }
                    }
                })
            }
        })
        t.list.field("details", {
            type: "jobDetails",
            resolve: async (parent): Promise<any> => {
                return await prisma.jobDetails.findMany({
                    where: {
                        jobPostID: parent.jobPostID
                    }
                })
            }
        })
        t.list.field("applicants", {
            type: "application",
            resolve: async (parent): Promise<any> => {
                return await prisma.applicant.findMany({
                    where: {
                        jobPostID: parent.jobPostID
                    }
                })
            }
        })
    },
})