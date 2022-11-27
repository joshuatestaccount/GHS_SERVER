import { objectType } from 'nexus';




export const uploadObject = objectType({
    name: "fileUpload",
    definition(t) {
        t.id("uploadFileID")
        t.string("file");
        t.string("video");
        t.date("createdAt");
    }
})