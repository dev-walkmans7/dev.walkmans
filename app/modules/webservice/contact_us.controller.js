const routeLabel = require('route-label');
const express = require('express');
const router = express.Router();
const namedRouter = routeLabel(router);
// const contactUsModel = require('contact_us/models/contact_us/.model.js');
const roleRepo = require('role/repositories/role.repository');
const contactUsRepo = require('contact_us/repository/contact_us.repository');
const mailer = require('../../helper/mailer.js');
const helper=require('../../helper/helper.js')
class contactUsController {
    constructor() {

     }

/**
 * 
 * @Methode:allcontactUs
 * @Description:To Show allcontactUs contactUs

 */
async submit(req,res) {


    try{
       
        if (!_.has(req.body, 'name') || (_.has(req.body, 'name') && (_.isNull(req.body.name) || _.isEmpty(req.body.name)))) {
              return { status: 201, data:{}, message: 'Name is required' };
                }
        else if (!_.has(req.body, 'email') || (_.has(req.body, 'email') && (_.isNull(req.body.email) || _.isEmpty(req.body.email)))) {
                return { status: 201, data:{}, message: 'Email is required' };
            
                } 
        else if (!_.has(req.body, 'phone') || (_.has(req.body, 'phone') && (_.isNull(req.body.phone) || _.isEmpty(req.body.phone)))) {
               return { status: 201, data:{}, message: 'phone is required' };
                }
        else if (!_.has(req.body, 'message') || (_.has(req.body, 'message') && (_.isNull(req.body.message) || _.isEmpty(req.body.message)))) {
               return { status: 201, data:{}, message: 'Message is required' };
                }
        else{  
               let SaveData = await contactUsRepo.save(req.body);
               if(!_.isEmpty(SaveData))
               {
              
                let emailData = {
                    site_logo_url: process.env.PUBLIC_PATH + "/assets/media/logos/Logo_highlevel.jpg",
                    name: SaveData.name,
                    email:SaveData.email,
                    phone:SaveData.phone,
                    message:SaveData.message
                  
                };
                
                let sendMail = await mailer.sendMail(`${process.env.APP_NAME}<${process.env.MAIL_USERNAME}>`,'walkman@yopmail.com', 'Account Created', 'user-add-details',emailData);
                let sendMailUser = await mailer.sendMail(`${process.env.APP_NAME}<${process.env.MAIL_USERNAME}>`,SaveData.email,"Successfull  Submission","user-data-submission");
                
            return { status: 200, data: SaveData, message: "Data send successfully!" };
    
            }
             else{
             return { status: 201, data:{}, message: 'Something is wrong' };
             }
    }
    }catch(e){
        await helper.storeError({ "api_url": "/api/contact-us/list", "error_msg": e.message });
            return { status: 500, data: {}, message: e.message };
    }
}

}


module.exports = new contactUsController();