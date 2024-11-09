const Auth = require('../auth/Auth');
const DataBase = require('../db/Database');
const Http = require('../api/Http');

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
                    return { data: 'Error', status: 500 }
                }
            },


            '/refresh': async (req, res) => {

                const cookie = req.headers.cookie;
                const oldRefToken = auth.parseTokenFromCookie(cookie);
                if (auth.validationToken(oldRefToken, 'refresh')) {
                    const newRefToken = auth.getRefreshToken();
                    return { data: { acc_token: auth.getAccessToken(), refresh_token: newRefToken, status: null }, headers: { 'set-cookie': `ref_token=${newRefToken}; HttpOnly; path=/refresh;` } }
                }
                return { data: 'Error', status: 403 }
            },

            '/test': (req, res) => {
                const token = req.headers.authorization;
                if (auth.validationToken(token, 'access')) {
                    const cookie = req.headers.cookie;
                    console.log(cookie, 'cookie')
                    return { data: 'Test Success' }
                }
                return { data: 'Error', status: 403 }
            },

            '/favicon.ico': (req, res) => 'handle faviicon',

            '/another': (req, res) => 'handle another',

            '/product': (req, res) => 'handleProduct'
        }
    }

}


module.exports = Routes;