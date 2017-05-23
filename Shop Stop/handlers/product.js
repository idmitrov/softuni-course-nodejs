const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const utils = require('../utils');

const database = require('../config/database');

module.exports = (req, res) => {
    let isProductUrl = req.pathname === '/product/add';
    
    req.pathname = req.pathname || url.parse(req.url).pathname;

    if (isProductUrl && req.method === 'GET') {
        let filePath = path.normalize(
            path.join(__dirname, '../views/products/add.html')
        );

        fs.readFile(filePath, (err, data) => {
            let status = 200,
                headers = {};
            
            headers['content-type'] = utils.getContentType(filePath);
            
            if (err) {
                status = 400;
                data = '404 Not found';
            }
            
            res.writeHead(status, headers);
            res.write(data);
            res.end();
        });
    } else if (isProductUrl && req.method === 'POST') {
        let dataString = '';

        req.on('data', data => {
            dataString += data;
        });

        req.on('end', () => {
            let product = qs.parse(dataString);

            database.products.add(product);

            res.writeHead(302, {
                "Location": "/"
            });

            res.end();
        });
    } else {
        return true;
    }
}