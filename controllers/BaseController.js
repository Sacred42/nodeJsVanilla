class BaseController {

    methods = {
        get: 'GET',
        post: 'POST',
        put: 'PUT',
        delete: 'DELETE'
    };

    controllers = [];

    createController(path, handler, requireAuth = false) {
        return { path, handler, requireAuth }
    }
}

module.exports = BaseController;