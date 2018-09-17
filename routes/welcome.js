const express = require('express');
const admin = require('../middleware/admin');
const Papa = require('papaparse');
const auth = require('../middleware/auth');
const moment = require('moment');
const Nci = require('../models/ncivalidation');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const router = express.Router();

// --------------------------DEFINE STORAGE----------
const storage = multer.diskStorage({
    destination: './upload/',
    filename: function(req, file, cb) {        
        cb(null, file.fieldname +''+ path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single('filename');

// --------------------------

router.get('/update', async (req, res) => {  // GET: /api/validations/update
    res.sendFile(path.join(__dirname, '../upload', 'upload.html'));
}); 


router.post('/code', async (req, res) => { // /api/validations/code
   const result = await Nci.find({orgcode: req.body.code});
   res.status(200).send(result);
});


router.post('/upload', async (req, res) => {  // POST: /api/validations/upload  

    upload(req, res, (err) => {  
       res.send('ok');
    });

    fs.readFile(path.join(__dirname, '../upload', 'filename.csv'), { encoding : 'utf8'}, (err, data) => { 
        if (err) console.error(err);

       Papa.parse(data, {
            header: true,
            worker: true,        
            complete: function(results) {
                data = results.data;
            }
        }); // Papa
        
        selectAndUpdate(data);
    });  // readFile
   // res.redirect('/');
}); // post

// --------------FUNCTIONS-------------------------------------------
       
async function saveToDatabase(data) {          
        const nci = new Nci({
            name: data.BATCHRECEIVER,        
            date: moment(data.BATCHDATE, 'DD.MM.YYYY h:mm:ss').format(),   // BATCHDATE": "30.08.2018 0:13:58",
            message: data.MSG_NAME,
            description: data.DESCRIPTION,
            orgcode: data.ORGCODE
        });
        const result = await nci.save();
        // console.log("saveToDatabase" + result);
}

async function selectAndUpdate(data) {    
        for (let i=0; i < data.length; i++) {
            try{
            const docs = await Nci.findOneAndUpdate({name: data[i].BATCHRECEIVER, orgcode: data[i].ORGCODE}, {
                $set: {
                    //name: data[i].BATCHRECEIVER,
                    date: moment(data[i].BATCHDATE, 'DD.MM.YYYY h:mm:ss').format(), // Error
                    message: data[i].MSG_NAME,
                    description: data[i].DESCRIPTION,
                    //orgcode: data[i].ORGCODE
                }
            }, {new: true});

            if (docs === null) 
                saveToDatabase(data[i]); 
                
        } catch (ex) {console.error(ex);}
                
                } // for
            }

module.exports = router;