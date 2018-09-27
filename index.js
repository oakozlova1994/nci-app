const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const auth = require('./routes/auth');
const welcome = require('./routes/welcome');
const users = require('./routes/users');
const error = require('./middleware/error');
require('./startup/prod')(app);
require('express-async-errors');
require('winston-mongodb');

// -----------------------------------JWT -------------------------
// if (!config.get('jwt')) {
//     throw new Error('FATAL ERROR: jwt is no defined');            
// }
// ------------------------------ MONGO --------------------------------------------
mongoose.connect(config.get('db'), {useNewUrlParser: true})
.then(() => winston.info('Connected to MongoDB...'));
// -------------------------------------- LOGS ----------------------------------
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());  
app.use('/', express.static(path.resolve(__dirname, "public")));    
app.use(morgan('dev'));
app.use('/api/validations', welcome);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);


const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`server was started: ${port}`)});




