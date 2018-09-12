const express = require('express');
const path = require('path');
const welcome = require('./routes/welcome');

const app = express();

require('./startup/prod')(app);

app.use(express.json());
app.use(express.urlencoded());
app.use(function(req, res, next) { // Read how to use CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/validation/api', welcome);

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`server was started: ${port}`)});




