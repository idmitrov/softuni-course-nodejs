const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const multiparty = require('multiparty');
const shortid = require('shortid');
const utils = require('../utils');
const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports = (req, res) => {
    let isProductUrl = req.pathname === '/product/add';
    
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
                
                res.writeHead(status, headers);
                res.write(data);
                res.end();
            }

            Category.find().then(categories => {
                let replacement = '<select class="input-field" name="category">';

                for (let category of categories) {
                    replacement += `<option value="${category._id}">${category.name}</option>`;
                }

                replacement += '</select>';

                let html = data.toString().replace(/{\s?categories\s?}/, replacement);
                
                res.writeHead(status, headers);
                res.write(html);
                res.end();
            });
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
            Product.create(product).then(createdProduct => {
                Category.findById(product.category).then(category => {
                    category.products.push(createdProduct._id);
                    category.save();

                    res.writeHead(302, {
                        "Location": "/"
                    });

                    res.end();
                });
            });
        });

        form.parse(req);
    } else {
        return true;
    }
}