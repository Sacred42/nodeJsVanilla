const Http = require('./api/Http');
const DataBase = require('./db/Database');
const Route = require('./routes/routes');

const http = new Http();
const route = new Route();

class Main {
    init = async function () {
        new DataBase();
        http.start(route.routes);

    }
}

module.exports = Main;