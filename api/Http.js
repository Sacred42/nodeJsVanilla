const http = require('http');
const crypto = require("crypto");
const HTTP_STATUS_CODE = require('../constants/httpStatusCode');
const { WebSocketServer } = require('ws');

const listAllowOrigin = ['http://localhost:4200', 'http://localhost:3000'];

const clients = [];

class Http {
    constructor() {
        this.headers = {
            "Access-Control-Allow-Headers": "Authorization ,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
            "Access-Control-Allow-Credentials": true,
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
            // 'Access-Control-Max-Age': 2592000, // 30 days
            // 'Content-Type': 'text/html'
        }
    }

    start = function (routes) {
        let socketRef;
        const wss = new WebSocketServer({ port: 8081 });
        // const id = new URLSearchParams().get('id');
        // console.log(id, 'id')
        wss.on('connection', function connection(ws) {
            console.log('connect1')
            wss.clients.forEach(function each(client) {

                client.send(JSON.stringify({ data: 'kanetct' }));
            })
            socketRef = ws;
            ws.on('error', console.error);

            ws.on('message', function message(data) {
                const currentClient = { id: JSON.parse(data.toString()).id, client: ws };
                clients.push(currentClient);
                console.log(clients, 'clients')
            });

            ws.send(JSON.stringify({ data: 'somethin', path: '/222' }));
        });

        const server = http.createServer(async (req, res) => {
            if (req.method === 'OPTIONS') {

                res.writeHead(204, {
                    'Access-Control-Allow-Origin': listAllowOrigin.includes(req.headers.origin) && req.headers.origin,
                    ...this.headers
                });

                res.end();
                return;
            }

            try {
                const { data, headers, status } = await routes[`${req.method}:${req.url}`](req, res, socketRef, clients);

                res.writeHead(status || 200, { ...this.headers, ...headers, 'Access-Control-Allow-Origin': listAllowOrigin.includes(req.headers.origin) && req.headers.origin, });

                res.end(JSON.stringify(data))
            } catch (error) {
                res.writeHead(error.status || HTTP_STATUS_CODE.SERVER_ERROR, { ...this.headers, 'Access-Control-Allow-Origin': listAllowOrigin.includes(req.headers.origin) && req.headers.origin, });
                res.end(JSON.stringify({ data: error.message || 'Internal Server Error', status: error.status || HTTP_STATUS_CODE.SERVER_ERROR }));
            }

        })

        server.on('upgrade', function upgrade(request, socket, head) {
            console.log('connect2')
        })

        server.listen(8080);

        server.on('error', function (error) {
            console.log('Server error', error);
        });
    }
}


module.exports = Http;


