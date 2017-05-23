const path = require('path');
const url = require('url');
const fs = require('fs');
const utils = require('../utils');

module.exports = (req, res) => {
    req.pathname = req.pathname || url.parse(req.url).pathname;
    
    let isStaticContent = req.pathname.startsWith('/content/') && req.method === 'GET';

    if (isStaticContent) {
        let filePath = path.normalize(
            path.join(__dirname, `../${req.pathname}`)
        );

        fs.readFile(filePath, (err, data) => {
            let headers =  {"content-type": "text/plain"},
                statusCode = 200;

            if (err) {
                statusCode = 400;
                data = '404 Resource not found!';
            } else {
                headers['content-type'] = utils.getContentType(req.pathname);
            }

            res.writeHead(statusCode, headers);
            res.write(data);
            res.end();
        });
    } else {
        return true;
    }
}