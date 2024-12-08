const Auth = require('../auth/Auth');
const HTTP_STATUS_CODE = require('../api/Http');
const BaseController = require('./BaseController');
const CustomError = require('../errors/CustomError');

const auth = new Auth();


class GeneralController extends BaseController {
    constructor() {
        super()
        return this.controllers = [
            this.createController(`${this.methods.get}:/`, this.index),
            this.createController(`${this.methods.get}:/test`, this.test, true),
        ]
    }

    async index(req, res, socket) {
        try {
            return { data: 'Hello world', status: 200 }
        } catch (error) {
            throw new CustomError({ error })
        }

    }

    async test(req, res) {
        try {
            return { data: 'Test Success' }
        } catch (error) {
            throw new CustomError({ error })
        }
    }


}

module.exports = GeneralController;