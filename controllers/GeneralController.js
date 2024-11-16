const Auth = require('../auth/Auth');
const HTTP_STATUS_CODE = require('../api/Http');
const BaseController = require('./BaseController');

const auth = new Auth();


class GeneralController extends BaseController {
    constructor() {
        super()
        return this.controllers = [
            this.createController(`${this.methods.get}:/`, this.index),
            this.createController(`${this.methods.get}:/test`, this.test, true),
        ]
    }

    async index(req, res) {
        return { data: 'Hello world', status: 200 }
    }

    async test(req, res) {
        return { data: 'Test Success' }
        // const token = req.headers.authorization;
        // if (auth.validationToken(token, 'access')) {
        //     const cookie = req.headers.cookie;
        //     return { data: 'Test Success' }
        // }
        // return { data: 'Error', status: HTTP_STATUS_CODE.FORBIDDEN }
    }


}

module.exports = GeneralController;