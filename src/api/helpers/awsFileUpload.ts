import SE3 from 'aws-sdk/clients/s3.js'


export const AWSFileUpload = async (filename: string, createReadStream) => {
    const S3 = new SE3({
        region: process.env.ACCESS_REGION,
        credentials: {
            accessKeyId: process.env.ACCESS_ID_KEY,
            secretAccessKey: process.env.ACCESS_SECRET_KEY
        },

    })


    const result = await S3.upload({
        Bucket: process.env.ACCESS_BUCKET_NAME,
        Key: filename,
        Body: createReadStream(),
        ContentType: "application/pdf"
    }).promise()


    return result.Location
}

export const AWSVideoUpload = async (filename: string, createReadStream) => {
    const S3 = new SE3({
        region: process.env.ACCESS_REGION,
        credentials: {
            accessKeyId: process.env.ACCESS_ID_KEY,
            secretAccessKey: process.env.ACCESS_SECRET_KEY
        },

    })


    const result = await S3.upload({
        Bucket: process.env.ACCESS_BUCKET_NAME,
        Key: filename,
        Body: createReadStream(),
        ContentType: "video/*"
    }).promise()


    return result.Location
}