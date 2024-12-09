const { WebSocketServer } = require('ws');

class Ws {
    clients = [];

    constructor() {
        if (Ws.instance) {
            return Ws.instance
        }
        Ws.instance = this;
        this.start();
    }

    start() {
        const wss = new WebSocketServer({ port: 8081 });
        wss.on('connection', (ws) => {
            wss.clients.forEach((client) => {

                client.send(JSON.stringify({ data: 'kanetct' }));
            })
            ws.on('error', console.error);

            ws.on('message', (data) => {
                const currentClient = { id: JSON.parse(data.toString()).id, client: ws };
                this.clients.push(currentClient);
            });
        });
    }

    setClients(id, client) {
        this.clients.push({ id: id, client: client })
    }

    getClientById(id) {
        return this.clients.find((item) => item.id === id).client;
    }
}

module.exports = Ws;