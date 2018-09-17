const express = require('express');
const app = express();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/prod')(app);
//require('./startup/config')();  // JWT

// ------------------------ CORS -----------------------------------
// app.use(function(req, res, next) {     
// res.header("Access-Control-Allow-Origin", "*");
// res.header("Access-Control-Allow-Headers", 
// "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     if(req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE, GET');
//         return res.status(200).json({});
//     }
//     next();    
// });
app.use(express.static('./public'));
const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`server was started: ${port}`)});




