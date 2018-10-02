const router = require('express').Router();
const admin = require('../middleware/admin');
const Papa = require('papaparse');
const auth = require('../middleware/auth');
const moment = require('moment');
const Nci = require('../models/ncivalidation');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const multerConf = {
    storage: multer.diskStorage({
        destination: function(req, file, next) {
            next(null, './upload');
        },
        filename: function(req, file, next) {
            next(null, file.fieldname + path.extname(file.originalname));
        }
    })
};


router.get('/update', async (req, res) => {  // GET: /api/validations/update    
    res.sendFile(path.join(__dirname, '../upload/','upload.html'));
}); 


router.post('/code', async (req, res) => { // /api/validations/code        
   const result = await Nci.find({orgcode: req.body.code});   
    let messages = result.filter(function(item) {
        return item.message !== '';
    });     
   
   res.status(200).send(messages);
});


router.post('/upload', multer(multerConf).single('filename'), async (req, res) => {  // POST: /api/validations/upload     
         
    fs.readFile(path.join(__dirname, '../upload/', 'filename.csv'), { encoding : 'utf8'}, (err, data) => { 
        if (err) console.error("read file: " + err);
       Papa.parse(data, {
            header: true,
            delimiter: "",	
	        trimHeaders: true,
           // worker: true,  
            complete: function(results) {
                console.log(results.data);
                data = results.data;                
            }
        }); // Papa
        
        selectAndUpdate(data);
    });  // readFile
    res.redirect('/');
}); // post

// --------------FUNCTIONS-------------------------------------------                                                    
async function saveToDatabase(data) {     
        try{         
        const nci = new Nci({
            groupfrom: data.BATCHSENDER,                
            date: moment(data.BATCHDATE, 'DD.MM.YYYY h:mm:ss').format(),   // BATCHDATE": "30.08.2018 0:13:58",
            message: data.MSG_NAME,
            description: data.DESCRIPTION,
            orgcode: data.ORGCODE,
            guid: data.REFPOSITIONID
        });
        
            await nci.save();
        } catch (ex) {console.error("Saving errors: " + ex);}        
}
  // 
async function selectAndUpdate(data) { 
        for (let i=0; i < data.length; i++) {                                 
            if (data[i].ORGCODE == '' && data[i].REFPOSITIONID == '' || data[i].MSG_NAME == '') continue;            
            try{   
            const docs = await Nci.findOneAndUpdate( { $and: [{ orgcode: {$eq: data[i].ORGCODE}, groupfrom: {$eq: data[i].BATCHSENDER}}]}, {
                $set: {
                    groupfrom: data[i].BATCHSENDER,                    
                    date: moment(data[i].BATCHDATE, 'DD.MM.YYYY h:mm:ss').format(), // Error
                    message: data[i].MSG_NAME,
                    description: data[i].DESCRIPTION,
                    orgcode: data[i].ORGCODE,
                    guid: data[i].REFPOSITIONID
                }
            }, {new: true});

            if (docs === null)                  
                saveToDatabase(data[i]); 
                
        } catch (ex) {console.error(ex);}
                
                } // for
            }

module.exports = router;

// 220I1106