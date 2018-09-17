const config = require('config');

module.exports = function() {    
    if (!config.get('jwt')) {
             throw new Error('FATAL ERROR: jwt is no defined');            
         }
}