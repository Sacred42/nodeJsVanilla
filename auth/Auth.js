const jwt = require('jsonwebtoken');

class Auth {
    constructor() { }

    getAccessToken() {
        return jwt.sign({ foo: process.env.SECRET_KEY_AUTH_ACCESS_TOKEN }, secretAccessToken, { expiresIn: '40s' })
    }

    getRefreshToken() {
        return jwt.sign({ foo: process.env.SECRET_KEY_AUTH_REFRESH_TOKEN }, secretRefreshToken, { expiresIn: '1200s' })
    }

    parseTokenFromCookie(cookie) {
        return cookie.split('=')[1];
    }

    validationToken(token, typeToken) {
        return jwt.verify(token, typeToken === 'refresh' ? process.env.SECRET_KEY_AUTH_ACCESS_TOKEN : process.env.SECRET_KEY_AUTH_REFRESH_TOKEN, (err) => {
            if (err) {
                return false
            }
            return true
        })
    }
}

module.exports = Auth;