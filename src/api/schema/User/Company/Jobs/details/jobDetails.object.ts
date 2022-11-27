import { prisma } from "../../../../../../server.js";
import { enumType, inputObjectType, objectType } from "nexus";

export const jobDetailsEnum = inputObjectType({
    name: "jobDetailsInput",

    definition(t) {
        t.list.string("location", {
            required: true
        });
        t.string("salary", {
            required: true
        });
        t.list.string("workType", {
            required: true
        });
        t.list.string("jobType", {
            required: true
        })
        t.string("category", {
            required: true
        });
    },
})
export const jobDetailsObject = objectType({
    name: "jobDetails",
    definition(t) {
        t.id("jobDetailsID");
        t.list.string("location");
        t.list.string("jobType");
        t.list.string("workType");
        t.string("category");
        t.string("salary");
        t.list.field("jobPost", {
            type: "JobPost",
            resolve: async (parent): Promise<any> => {
                return await prisma.jobPost.findMany({
                    where: {
                        details: {
                            jobDetailsID: parent.jobDetailsID
                        }
                    }
                })
            }
        })
    }
})