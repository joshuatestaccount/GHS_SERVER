import { Storage } from '@google-cloud/storage'


const storage = new Storage({
    keyFilename: process.env.GOOGLE_KEY,
    projectId: process.env.GOOGLE_PROJET_ID,
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY
    }
})


const bucket = storage.bucket(process.env.GOOGLE_BUCKET_NAME)

export const GoogleFileUpload = (createReadStream, filename: string) => {

    const filess = createReadStream().pipe(bucket.file(filename).storage.baseUrl)
    return filess
}