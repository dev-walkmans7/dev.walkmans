const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const contactUsController = require('webservice/contact_us.controller');

const multer = require("multer");

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (file.fieldname === 'profile_pic') {
            callback(null, "./public/uploads/user/profile_pic")

        }else if (file.fieldname === 'medical_license_file') {
            callback(null, "./public/uploads/medical_license_files")

        }else {
            callback(null, "./public/uploads");
        
        }
    },
    filename: (req, file, callback) => {
        // callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});
const request_param = multer();
/**
  @api{POST}/contact-us/submit Submit Data
  @apiGroup Contact
  @apiSuccessExample {json} Success
 {
    "status": 200,
    "data": {
        "name": "Rock",
        "email": "roy@yopmail.com",
        "phone": "2222333369",
        "message": "How are you?",
        "status": "Active",
        "isDeleted": false,
        "_id": "649306ee5952b8e8ee714263",
        "createdAt": "2023-06-21T14:19:26.781Z",
        "updatedAt": "2023-06-21T14:19:26.781Z"
    },
    "message": "Data send successfully!"
}
**/

namedRouter.post("api.contact-us.submit", '/contact-us/submit', request_param.any(),async(req,res)=>{
       try{
        const success= await contactUsController.submit(req);
        res.status(success.status).send(success);
       }catch(e){;
        res.status(e.status).send(e)
       }    
});

// Export the express.Router() instance
module.exports = router;