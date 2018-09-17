const express = require('express');
const path = require('path');
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

// app.set('view engine', 'ejs');
// app.use('/public', express.static('public'));
app.use(express.static(__dirname + "/public"));
app.get('/', function(req, res) {
    res.render('index');
})

//if(process.env.NODE_ENV === 'production') {
    // app.use(express.static('client/dist/client'));
    // app.get('*', (req, res) => {
    //     res.sendFile(path.resolve(
    //         __dirname, 'client', 'dist', 'client', 'index.html'
    //     ))
    // });
//}

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`server was started: ${port}`)});




