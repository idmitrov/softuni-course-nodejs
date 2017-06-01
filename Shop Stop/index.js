const http = require('http');
const url = require('url');
const port = 3000;

const environment = process.env.NODE_ENV || 'development';
const handlers = require('./handlers');
const config = require('./config/config');
const database = require('./config/database.config');

database(config[environment]);

http.createServer((req, res) => {
    req.pathname = req.pathname || url.parse(req.url).pathname;
    
    for (let handler of handlers) {
        if (!handler(req, res)) {
            break;
        }
    }

    console.log(`Srver is runing on http://localhost:${port}/`)
}).listen(port);