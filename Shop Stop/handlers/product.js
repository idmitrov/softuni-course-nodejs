const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const multiparty = require('multiparty');
const shortid = require('shortid');
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
        let form = new multiparty.Form()
            product = {};

        form.on('part', part => {
            if (part.filename) {
                let dataString = '';

                part.setEncoding('binary');

                part.on('data', data => {
                    dataString += data;
                });    

                part.on('end', () => {
                    let filename = shortid.generate(),
                        fileNameParts = part.filename.split(/[.]/g),
                        fileExtension = fileNameParts[fileNameParts.length - 1];
                    
                    filePath = `/content/images/${filename}.${fileExtension}`;
                    product.image = filePath;

                    fs.writeFile(`.${filePath}`, dataString, {encoding: 'ascii'}, err => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('image saved!')
                        }
                    });
                });
            } else {
                let field = '';

                part.setEncoding('utf-8');

                part.on('data', data => {
                    field += data;
                });

                part.on('end', () => {
                    product[part.name] = field;
                });
            }
        });

        form.on('close', () => {
            database.products.add(product);

            res.writeHead(302, {
                "Location": "/"
            });

            res.end();
        });

        form.parse(req);
    } else {
        return true;
    }
}