export default function generateOTP(length: number) {
    var digits = '0123456789'
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[ Math.floor(Math.random() * 10) ];
    }
    return otp
}
