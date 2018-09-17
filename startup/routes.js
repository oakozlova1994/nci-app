const auth = require('../routes/auth');
const welcome = require('../routes/welcome');
const users = require('../routes/users');
const error = require('../middleware/error');
const bodyParser = require('body-parser');
const morgan = require('morgan');

module.exports = function(app) {    
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());    
    app.use(morgan('dev'));
    app.use('/api/validations', welcome);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use(error);
}