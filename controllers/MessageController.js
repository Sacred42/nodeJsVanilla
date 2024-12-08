const BaseController = require('./BaseController');
const CustomError = require('../errors/CustomError');
const DataBase = require('../db/Database');
const getBody = require('../helpers/getBody');

const db = new DataBase();
class MessageController extends BaseController {
    constructor() {
        super()
        return this.controllers = [
            this.createController(`${this.methods.post}:/send_message`, this.sendMessage),
            this.createController(`${this.methods.post}:/read_message`, this.readMessage),
        ]
    }

    async sendMessage(req, res, socket) {
        try {
            const { body } = JSON.parse(await getBody(req));
            await db.createMessage(body.chat_id, body.user_id, body.text);
            return { data: { message: 'Message sent', status: null } }
        } catch (error) {
            throw new CustomError({ error })
        }
    }

    async readMessage(req, res, socket, clients) {
        try {
            const { body } = JSON.parse(await getBody(req));
            if (body.ids.length) {
                await db.readMessages(body.ids.toString());
            }
            if (socket) {
                const currentClient = clients.find((item) => item.id === body.to).client;
                currentClient.send(JSON.stringify({ data: 'done', path: '/message' }));
            }
            return { data: { message: 'Message read', status: null } }
        } catch (error) {
            throw new CustomError({ error })
        }
    }
}

module.exports = MessageController;