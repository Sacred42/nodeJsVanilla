const http = require('http');

class Http {
    constructor() {
        this.headers = {
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            "Access-Control-Allow-Headers": "Authorization ,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
            "Access-Control-Allow-Credentials": true,
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
            // 'Access-Control-Max-Age': 2592000, // 30 days
            // 'Content-Type': 'text/html'
        }
    }

    start = function (routes) {
        const mainHeaders = this.headers;
        const server = http.createServer(async function (req, res) {
            if (req.method === 'OPTIONS') {
                res.writeHead(204, mainHeaders);
                res.end();
                return;
            }

            try {
                const { data, headers, status } = await routes[`${req.method}:${req.url}`](req, res);

                res.writeHead(status || 200, { ...mainHeaders, ...headers });

                res.end(JSON.stringify(data))
            } catch (error) {
                throw new CustomError({ error })
            }

        }
        )

        server.listen(8080);

        server.on('error', function (error) {
            console.log('Server error', error);
        });
    }
}


module.exports = Http;


