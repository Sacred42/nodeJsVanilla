const AuthController = require('../controllers/AuthController');
const GeneralController = require('../controllers/GeneralController');
const checkAuthToken = require('../helpers/checkAuthToken');


class Routes {
    routes = {};
    bindControllers() {
        const allControllers = [
            ...new AuthController(),
            ...new GeneralController()
        ]

        allControllers.forEach((controller) => {
            if (controller.requireAuth) this.routes[controller.path] = (req, res) => checkAuthToken(req, res, controller.handler)

            else this.routes[controller.path] = controller.handler;
        })
    }
    constructor() {
        this.bindControllers();
        return this.routes;
    }

}


module.exports = Routes;