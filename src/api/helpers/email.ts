import nodemailer from 'nodemailer'



/** 
 * Example using Nodemailer with Google Gmail.
 * https://alexb72.medium.com/how-to-send-emails-using-a-nodemailer-gmail-and-oauth2-fe19d66451f9
 * https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a
 * 
**/

export async function GESend(Email: string, message: string, subject: string) {
    let accounts = nodemailer.createTransport({
        auth: {
            type: "OAuth2",
            user: process.env.GMAIL_ACCOUNT,    //gmail account you useds to set the project up in google cloud console.
            clientId: process.env.GMAIL_CLIENTID, // ClientID 
            clientSecret: process.env.GMAIL_CLIENTSECRET, // Client Secret
            refreshToken: process.env.GMAIL_REFRESHTOKEN, // Refresh Token
            accessToken: process.env.ACCESSTOKEN // Access Token Variable we defined earlier
        }
    })


    await accounts.sendMail({
        from: process.env.GMAIL_ACCOUNT,
        to: Email,
        subject: subject,
        text: message,
    })

}