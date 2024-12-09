const Ws = require('../service/Ws');

class BaseController {

    methods = {
        get: 'GET',
        post: 'POST',
        put: 'PUT',
        delete: 'DELETE'
    };
    controllers = [];

    ws = new Ws();

    createController(path, handler, requireAuth = false) {
        return { path, handler, requireAuth }
    }
}

module.exports = BaseController;