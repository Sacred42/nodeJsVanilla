const BaseController = require('./BaseController');
const getBody = require('../helpers/getBody');
const Auth = require('../auth/Auth');
const DataBase = require('../db/Database');
const HTTP_STATUS_CODE = require('../constants/httpStatusCode');
const CustomError = require('../errors/CustomError');

const auth = new Auth();
const db = new DataBase();
class AuthController extends BaseController {
    constructor() {
        super()
        return this.controllers = [
            this.createController(`${this.methods.post}:/auth`, this.auth),
            this.createController(`${this.methods.post}:/register`, this.register),
            this.createController(`${this.methods.post}:/login`, this.login),
            this.createController(`${this.methods.post}:/refresh`, this.refresh),
        ]
    }

    async auth(req, res) {
        try {
            const { body } = JSON.parse(await getBody(req));
            const refToken = auth.getRefreshToken();
            await db.setUsers(body.id, body.name, refToken);
            return { data: { acc_token: auth.getAccessToken(), refresh_token: refToken, status: null }, headers: { 'set-cookie': `ref_token=${refToken}; HttpOnly; path=/refresh;` } }
        } catch (error) {
            return { data: 'Error', status: HTTP_STATUS_CODE.SERVER_ERROR }
        }
    }

    async register(req, res) {
        try {
            const { body } = JSON.parse(await getBody(req));
            const refToken = auth.getRefreshToken();
            await db.setUsers(body.name, body.password, refToken);
            return { data: { acc_token: auth.getAccessToken(), refresh_token: refToken, status: null }, headers: { 'set-cookie': `ref_token=${refToken}; HttpOnly; path=/refresh;` } }
        } catch (error) {
            return { data: error.message, status: error.status }
        }
    }

    async login(req, res) {
        try {
            const { body } = JSON.parse(await getBody(req));
            const refToken = auth.getRefreshToken();
            const data = await db.validateUser(body.name, body.password);
            if (data) {
                return { data: { acc_token: auth.getAccessToken(), refresh_token: refToken, status: null }, headers: { 'set-cookie': `ref_token=${refToken}; HttpOnly; path=/refresh;` } }
            }
            throw new CustomError({ message: 'User not found', status: HTTP_STATUS_CODE.NOT_FOUND });
        } catch (error) {
            return { data: error.message, status: error.status }
        }
    }

    async refresh(req, res) {
        const cookie = req.headers.cookie;
        const oldRefToken = auth.parseTokenFromCookie(cookie);
        if (auth.validationToken(oldRefToken, 'refresh')) {
            const newRefToken = auth.getRefreshToken();
            return { data: { acc_token: auth.getAccessToken(), refresh_token: newRefToken, status: null }, headers: { 'set-cookie': `ref_token=${newRefToken}; HttpOnly; path=/refresh;` } }
        }
        return { data: 'Error', status: HTTP_STATUS_CODE.FORBIDDEN }
    }
}

module.exports = AuthController;