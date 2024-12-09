const BaseController = require('./BaseController');
const CustomError = require('../errors/CustomError');
const DataBase = require('../db/Database');
const getBody = require('../helpers/getBody');

const db = new DataBase();
class MessageController extends BaseController {
    constructor() {
        super()
    }

    initControllers() {
        return this.controllers = [
            this.createController(`${this.methods.post}:/send_message`, this.sendMessage),
            this.createController(`${this.methods.post}:/read_message`, this.readMessage),
        ]
    }

    sendMessage = async (req, res) => {
        try {
            const { body } = JSON.parse(await getBody(req));
            await db.createMessage(body.chat_id, body.user_id, body.text);
            return { data: { message: 'Message sent', status: null } }
        } catch (error) {
            throw new CustomError({ error })
        }
    }

    readMessage = async (req, res) => {
        try {
            const { body } = JSON.parse(await getBody(req));
            if (body.ids.length) {
                await db.readMessages(body.ids.toString());
            }
            if (this.ws) {
                const currentClient = this.ws.getClientById(body.to);
                currentClient.send(JSON.stringify({ data: 'done', path: '/message' }));
            }
            return { data: { message: 'Message read', status: null } }
        } catch (error) {
            throw new CustomError({ error })
        }
    }
}

module.exports = MessageController;