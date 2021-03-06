const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const utils = require('../utils');
const Product = require('../models/Product');

module.exports = (req, res) => {
    req.pathname = req.pathname || url.parse(req.url).pathname;

    if (req.pathname === '/' && req.method === 'GET') {
        let filePath = path.join(__dirname, '../views/home/index.html');

        fs.readFile(filePath, (err, data) => {
            let headers = {},
                statusCode = 400,
                htmlContent = '404 Not Found';
            
            if (err) {
                res.writeHead(statusCode, headers);
                res.write(htmlContent);
                res.end();  
            } else {
                Product.find().then(products => {
                    let urlQuery = qs.parse(url.parse(req.url).query),
                        content = '';

                    if (urlQuery.query && products.length) {
                        products = products
                            .filter(p => p.name.toLowerCase().includes(urlQuery.query));
                    }
                    
                    for (let product of products) {
                        content += `
                            <div class="product-card">
                                <img class="product-image" src="${product.image}"/>
                                <h2>${product.name}</h2>
                                <p>${product.description}</p>
                            </div>
                        `;
                    }

                    statusCode = 200;
                    htmlContent = data.toString().replace(/{\s?content\s?}/, content);
                    headers['content-type'] = utils.getContentType(filePath);
                    
                    res.writeHead(statusCode, headers);
                    res.write(htmlContent);
                    res.end();
                });
            }
        });
    } else {
        return true;
    }
}