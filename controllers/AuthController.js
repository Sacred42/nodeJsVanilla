const BaseController = require('./BaseController');
const getBody = require('../helpers/getBody');
const Auth = require('../auth/Auth');
const DataBase = require('../db/Database');
const HTTP_STATUS_CODE = require('../constants/httpStatusCode');
const CustomError = require('../errors/CustomError');
const Chat = require('../entity/Chat');
const User = require('../entity/User');

const auth = new Auth();
const db = new DataBase();
class AuthController extends BaseController {
    constructor() {
        super()
        return this.controllers = [
            this.createController(`${this.methods.post}:/auth`, this.auth),
            this.createController(`${this.methods.post}:/register`, this.register),
            this.createController(`${this.methods.post}:/login`, this.login),
            this.createController(`${this.methods.get}:/refresh`, this.refresh),
            this.createController(`${this.methods.get}:/user`, this.getUser),
        ]
    }

    async auth(req, res, socket) {
        try {
            const { body } = JSON.parse(await getBody(req));
            const refToken = auth.getRefreshToken();
            const authToken = auth.getAccessToken();
            await db.setUsers(body.name, body.password, refToken, authToken);
            return { data: { acc_token: authToken, refresh_token: refToken, status: null }, headers: { 'set-cookie': `ref_token=${refToken}; HttpOnly; path=/refresh;` } }
        } catch (error) {
            throw new CustomError({ error })
        }
    }

    async register(req, res, socket) {
        try {
            const { body } = JSON.parse(await getBody(req));
            const refToken = auth.getRefreshToken();
            const authToken = auth.getAccessToken();
            await db.setUsers(body.name, body.password, refToken, authToken);
            return { data: { acc_token: authToken, refresh_token: refToken, status: null }, headers: { 'set-cookie': `ref_token=${refToken}; HttpOnly; path=/refresh;` } }
        } catch (error) {
            throw new CustomError({ error })
        }
    }

    async login(req, res, socket) {
        try {
            const { body } = JSON.parse(await getBody(req));
            const data = await db.validateUser(body.name, body.password);
            if (data) {
                const refToken = auth.getRefreshToken();
                const authToken = auth.getAccessToken();
                await db.updateSession(data.personid, refToken, authToken);
                return { data: { acc_token: authToken, refresh_token: refToken, status: null }, headers: { 'set-cookie': `ref_token=${refToken}; HttpOnly; path=/refresh;` } }
            }
            throw new CustomError({ message: 'User not found', status: HTTP_STATUS_CODE.NOT_FOUND });
        } catch (error) {
            throw new CustomError({ error })
        }
    }

    async refresh(req, res, socket) {
        try {
            const cookie = req.headers.cookie;
            const oldRefToken = auth.parseTokenFromCookie(cookie);
            if (auth.validationToken(oldRefToken, 'refresh')) {
                const newRefToken = auth.getRefreshToken();
                const authToken = auth.getAccessToken();
                const personId = await db.getUserIdByRefToken(oldRefToken);
                await db.updateSession(personId, refToken, authToken);
                return { data: { acc_token: authToken, refresh_token: newRefToken, status: null }, headers: { 'set-cookie': `ref_token=${newRefToken}; HttpOnly; path=/refresh;` } }
            }
            throw new CustomError({ message: 'Refresh token not valid', status: HTTP_STATUS_CODE.FORBIDDEN });
        } catch (error) {
            throw new CustomError({ error })
        }
    }

    async getUser(req, res, socket) {
        try {
            const cookie = req.headers.authorization;
            const userDb = await db.getUserByAuthToken(cookie);

            if (!userDb.rows.length) throw new CustomError({ message: 'User not found', status: HTTP_STATUS_CODE.NOT_FOUND });

            const chatsDb = await db.getChats(userDb.rows[0].personid);
            const chats = new Chat(chatsDb);
            //TODO
            const messageRecipient = chats[0].messages.find((item) => item.user_id !== userDb.rows[0].personid);
            chats[0].recipient = {
                name: messageRecipient.user_name, id: messageRecipient.
                    user_id
            }

            const user = new User(userDb.rows[0].name, userDb.rows[0].role, userDb.rows[0].personid);


            return { data: { user, chats } }
        } catch (error) {
            throw new CustomError({ error })
        }
    }
}

module.exports = AuthController;