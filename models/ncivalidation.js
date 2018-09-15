const mongoose = require('mongoose');

    const nciSchema = new mongoose.Schema({       
        name: { type: String, default: ''},        
        date: {type: Date, default: Date.now},   
        message:{ type: String, default: ''},
        description: { type: String, default: ''},
        orgcode: { type: String, default: ''}
    });

    module.exports = mongoose.model('Nci', nciSchema);

    // "BATCHSENDER": "НСИ",
    //     "BATCHRECEIVER": "OSGMU",
    //     "XID": "d6e8dcb4-0833-4cef-a25e-b96635db5b42",
    //     "BATCHDATE": "30.08.2018 0:13:58",
    //     "MSG_CODE": "E904",
    //     "MSG_LEVEL": "критичная",
    //     "MSG_NAME": "Ошибки бизнес контролей",
    //     "DESCRIPTION": "Импорт сведений для организации 123Щ8288 не возможен. Поле ?Должность руководителя? (HeadPost) обязательно для заполнения в отношении организации с типом ?Учреждение? (OrgTypeCode = 03)",
    //     "ORGCODE": "123Щ8288",
    //     "REFPOSITIONID": "6dfc8a04-9682-4a5c-beb0-d3e3ec510956",
    //     "": ""

    // $env:nci_db="mongodb://localhost:27017/ncivalidation"