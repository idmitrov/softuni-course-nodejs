const filesHandle = require('./static-files');
const homeHandler = require('./home');
const productHandler = require('./product');
const categoryHandler = require('./category');

module.exports = [
    filesHandle,
    homeHandler,
    productHandler,
    categoryHandler
];