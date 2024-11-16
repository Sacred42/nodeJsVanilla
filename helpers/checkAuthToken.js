const Auth = require('../auth/Auth');
const CustomError = require('../errors/CustomError');
const auth = new Auth();

const checkAuthToken = (req, res, next) => {
    const cookie = req.headers.cookie;
    if (cookie) {
        if (auth.validationToken(cookie, 'access')) {
            return next(req, res);
        } else {
            throw new CustomError({ message: 'Unauthorized', status: 401 });
        }
    } else {
        throw new CustomError({ message: 'Unauthorized', status: 401 });
    }
}

module.exports = checkAuthToken;