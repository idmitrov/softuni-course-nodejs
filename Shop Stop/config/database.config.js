const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = (config) => {
    mongoose.connect(config.connectionString);

    let database = mongoose.connection;

    database.once('open', err => {
        if (err) {
            return console.log(err);
        }

        console.log('Connected to db');
    });

    database.on('error', err => {
        cosnole.log(err);
    });

    require('../models/Category');
    require('../models/Product');
}