const fs = require('fs');

const constants = {
    error: {
        keyNotExist: 'The provided key does not exist',
        keyAlreadyExist: 'The provided key already exist',
        invalidKeyType: 'The type of the provided key shoudld be a string'
    },
    file: {
        name: 'storage',
        extension: 'dat'
    }
};

let validateKeyType = (key) => {
    if (typeof key != 'string') {
        throw Error(constants.error.invalidKeyType);
    }
}

let validateKeyExist = (key, collection = storage) => {
    if (!collection[key]) {
        throw Error(constants.error.keyNotExist);
    }
}

validateKeyDuplicate = (key, collection = storage) => {
    if (collection[key]) {
        throw Error(constants.error.keyAlreadyExist);
    }
}

let storage = {};
module.exports = {
    put: (key, value) => {
        validateKeyType(key);
        validateKeyDuplicate(key);
        
        storage[key] = value;
    },
    get: (key) => {
        validateKeyType(key);
        validateKeyExist(key);

        return storage[key];
    },
    update: (key, value) => {
        validateKeyType(key);
        validateKeyExist(key);

        storage[key] = value;        
    },
    delete: (key) => {
        validateKeyType(key);
        validateKeyExist(key);

        storage[key] = null;        
    },
    clear: () => {
        let { extension, name } = constants.file;
        
        storage = {};
        fs.unlink(`${name}.${extension}`, err => null);
    },
    save: (data = storage) => {
        let { extension, name } = constants.file;

        fs.writeFile(`${name}.${extension}`, JSON.stringify(data), err => {
            if (err) {
                return console.log(err);
            }
        });
    },
    load: (fileEncoding = 'utf8') => {
        let { extension, name } = constants.file;
        
        fs.readFile(`${name}.${extension}`, fileEncoding, (err, data) => {
            if (!err) {
                storage = JSON.parse(data);
            }
        });
    }
};