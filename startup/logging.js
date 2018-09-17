const config = require('config');
const winston = require('winston');
require('express-async-errors');
require('winston-mongodb');

module.exports = function() {
    winston.handleExceptions(
    new winston.transports.Console({colorize: true, prettyPrint: true }),
    new winston.transports.File({filename: 'uncaughtExceptions.log'})); // Sync Errors

process.on('uncaughtRejection', (ex) => {  // Async Promise Errors     
    throw ex;
});

winston.add(winston.transports.File, {filename: '../logfile.log'});
winston.add(winston.transports.MongoDB, {
    db: config.get('db'),
    level: 'info'
});
}
// ------------------------------------------ System Logining ---------------

