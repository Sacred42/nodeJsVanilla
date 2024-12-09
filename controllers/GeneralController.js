const Auth = require('../auth/Auth');
const HTTP_STATUS_CODE = require('../service/Http');
const BaseController = require('./BaseController');
const CustomError = require('../errors/CustomError');

const auth = new Auth();


class GeneralController extends BaseController {
    constructor() {
        super()
    }

    initControllers() {
        return this.controllers = [
            this.createController(`${this.methods.get}:/`, this.index),
            this.createController(`${this.methods.get}:/test`, this.test, true),
        ]
    }

    index = async (req, res) => {
        try {
            return { data: 'Hello world', status: 200 }
        } catch (error) {
            throw new CustomError({ error })
        }

    }

    test = async (req, res) => {
        try {
            return { data: 'Test Success' }
        } catch (error) {
            throw new CustomError({ error })
        }
    }


}

module.exports = GeneralController;