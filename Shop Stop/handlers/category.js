const fs = require('fs');
const qs = require('querystring');
const path = require('path');

const utils = require('../utils');
const Category = require('../models/Category');

module.exports = (req, res) => {
    let isCategoryUrl = req.pathname === '/category/add';

    if (isCategoryUrl && req.method === 'GET') {
        fs.readFile('./views/category/add.html', (err, data) => {
            if (err) {
                return console.log(err);
            }

            let filePath = path.normalize(
                path.join(__dirname, '../views/category/add.html')
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
        });
    } else if (isCategoryUrl && req.method === 'POST') {
        let queryData = '';

        req.on('data', data => {
            queryData += data;
        });

        req.on('end', () => {
            let category = qs.parse(queryData);

            Category.create(category).then(() => {
                res.writeHead(302, {
                    "Location": "/"
                });

                res.end();
            });
        });
    } else {
        return true;
    }
}