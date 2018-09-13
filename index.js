const express = require('express');
const welcome = require('./routes/welcome');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

require('./startup/prod')(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) { // Read how to use CORS    
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", 
"Origin, X-Requested-With, Content-Type, Accept");  
    next();
});

app.use(morgan('dev'));

app.use('/validation/api', welcome);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status(404);
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`server was started: ${port}`)});




