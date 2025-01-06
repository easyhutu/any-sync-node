const OtpAuth = require('otpauth')
require('dotenv').config()

// Create a new TOTP object.
const totp = new OtpAuth.TOTP({
    issuer: "AnySync",
    label: "Remote",
    algorithm: "SHA1",
    digits: 6,
    period: 122,
    secret: process.env.OAUTH,
});
module.exports = {
    totp
}
