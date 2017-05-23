const filesHandle = require('./static-files');
const homeHandler = require('./home');
const productHandler = require('./product');

module.exports = [
    filesHandle,
    homeHandler,
    productHandler
];