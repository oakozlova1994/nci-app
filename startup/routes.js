const auth = require('../routes/auth');
const express = require('express');
const welcome = require('../routes/welcome');
const users = require('../routes/users');
const error = require('../middleware/error');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

module.exports = function(app) {    
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());  
    app.use('/', express.static(path.resolve(__dirname, '../', "public")));    
    app.use(morgan('dev'));
    app.use('/api/validations', welcome);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use(error);
    app.get('/', (req, res) => {
        res.sendFile('index.html');
    }) 
}