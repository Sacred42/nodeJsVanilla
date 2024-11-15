const Auth = require('../auth/Auth');
const DataBase = require('../db/Database');
const Http = require('../api/Http');
const CustomError = require('../errors/CustomError');
const HTTP_STATUS_CODE = require('../api/Http');

const auth = new Auth();
const db = new DataBase();
const http = new Http();

class Routes {

    constructor() {
        this.routes = {
            '/': (req, res) => 'Hello Main',

            '/auth': async (req, res) => {
                try {
                    const { body } = JSON.parse(await http.handleStream(req));
                    const refToken = auth.getRefreshToken();
                    await db.setUsers(body.id, body.name, refToken);
                    return { data: { acc_token: auth.getAccessToken(), refresh_token: refToken, status: null }, headers: { 'set-cookie': `ref_token=${refToken}; HttpOnly; path=/refresh;` } }
                } catch (error) {
                    return { data: 'Error', status: HTTP_STATUS_CODE.SERVER_ERROR }
                }
            },

            '/register': async (req, res) => {
                try {
                    const { body } = JSON.parse(await http.handleStream(req));
                    const refToken = auth.getRefreshToken();
                    await db.setUsers(body.name, body.password, refToken);
                    return { data: { acc_token: auth.getAccessToken(), refresh_token: refToken, status: null }, headers: { 'set-cookie': `ref_token=${refToken}; HttpOnly; path=/refresh;` } }
                } catch (error) {
                    console.log(error, 'er')
                    return { data: error.message, status: error.status }
                }
            },


            '/refresh': async (req, res) => {
                const cookie = req.headers.cookie;
                const oldRefToken = auth.parseTokenFromCookie(cookie);
                if (auth.validationToken(oldRefToken, 'refresh')) {
                    const newRefToken = auth.getRefreshToken();
                    return { data: { acc_token: auth.getAccessToken(), refresh_token: newRefToken, status: null }, headers: { 'set-cookie': `ref_token=${newRefToken}; HttpOnly; path=/refresh;` } }
                }
                return { data: 'Error', status: HTTP_STATUS_CODE.FORBIDDEN }
            },

            '/login': async (req, res) => {
                try {
                    const { body } = JSON.parse(await http.handleStream(req));
                    const refToken = auth.getRefreshToken();
                    const data = await db.validateUser(body.name, body.password);
                    if (data) {
                        return { data: { acc_token: auth.getAccessToken(), refresh_token: refToken, status: null }, headers: { 'set-cookie': `ref_token=${refToken}; HttpOnly; path=/refresh;` } }
                    }
                    throw new CustomError({ message: 'User not found', status: HTTP_STATUS_CODE.NOT_FOUND });
                } catch (error) {
                    return { data: error.message, status: error.status }
                }
            },

            '/test': (req, res) => {
                console.log(req.headers)
                const token = req.headers.authorization;
                if (auth.validationToken(token, 'access')) {
                    const cookie = req.headers.cookie;
                    console.log(cookie, 'cookie')
                    return { data: 'Test Success' }
                }
                return { data: 'Error', status: HTTP_STATUS_CODE.FORBIDDEN }
            },

            '/favicon.ico': (req, res) => 'handle faviicon',

            '/another': (req, res) => 'handle another',

            '/product': (req, res) => 'handleProduct'
        }
    }

}


module.exports = Routes;