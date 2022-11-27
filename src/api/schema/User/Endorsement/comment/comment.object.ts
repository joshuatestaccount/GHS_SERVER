import { extendType, inputObjectType, objectType } from 'nexus';

export const commentInput = inputObjectType({
    name: "commentInput",
    definition(t) {
        t.string("message");
        t.string("notes");
    },
})
export const commentObject = objectType({
    name: "comment",
    definition(t) {
        t.id("commentID");
        t.string("message");
        t.string("notes");
        t.date("createdAt");
        t.date("updatedAt");
    },
})