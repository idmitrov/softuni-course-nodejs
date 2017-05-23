const path = require('path');

module.exports = {
    getContentType: (url) => {
        let contentExtension = path.extname(url);

        switch(contentExtension) {
            case '.css':
                return 'text/css';
            case '.js':
                return 'application/javascript';
            case '.ico':
                return 'image/x-icon';
            case '.html':
                return 'text/html';
            case '.jpg':
            case '.jpeg':
            case '.gif':
            case '.png':
                return 'image/jpeg';
            default: return 'text/plain';
        }
    }
};