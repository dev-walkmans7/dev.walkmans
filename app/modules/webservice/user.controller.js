const mongoose = require('mongoose');
const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
var moment = require('moment');
const mailer = require('../../helper/mailer.js');
const helper = require('../../helper/helper.js');
const jwt = require('jsonwebtoken');
const userModel = require('user/models/user.model.js');
const User = new userModel();
const roleRepo = require('role/repositories/role.repository');
const userRepo = require('user/repositories/user.repository');
const fs = require('fs');
const otp = require('otp-generator');
const {
    join
} = require('path');
const ejs = require('ejs');
const {
    readFile
} = require('fs');
const {
    promisify
} = require('util');
const readFileAsync = promisify(readFile);
const gm = require('gm').subClass({
    imageMagick: true
});

class UserController {
    constructor() { }
  /*
     * /@Method: signup
     * /@Description:User Signup
    */
    async signup(req, res) {
        try {     
            if (!_.has(req.body, 'full_name') || (_.has(req.body, 'full_name') && (_.isUndefined(req.body.full_name) || _.isNull(req.body.full_name) || _.isEmpty(req.body.full_name)))) {
                return { "status": 201, data: {}, "message": "Full name is required" };
            }
           
            
            if (!_.has(req.body, 'email') || (_.has(req.body, 'email') && (_.isUndefined(req.body.email) || _.isNull(req.body.email) || _.isEmpty(req.body.email)))) {
                return { "status": 201, data: {}, "message": "Email is required" };
            }
           
            if (!_.has(req.body, 'password') || (_.has(req.body, 'password') && (_.isUndefined(req.body.password) || _.isNull(req.body.password) || _.isEmpty(req.body.password)))) {
                return { "status": 201, data: {}, "message": "Password is required" };
            }  
            
            
            req.body.email = req.body.email.trim().toLowerCase();
            let userExist = await userRepo.getByField({
                "email": req.body.email,
                "isDeleted": false
            });

            if (!_.isEmpty(userExist)) {                
                return { status: 201, data: {}, message: "User already exists with this email!" };
            }
            else{

               

                    var roleInfo = await roleRepo.getByField({"role" : "user", "rolegroup" : "frontend"});
                    req.body.role = roleInfo._id;

                    var original_psw = req.body.password;
                    // let emailOTP = otp.generate(4, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
                    req.body.password = User.generateHash(original_psw);                

                    let userSave = await userRepo.save(req.body);
        
                    if (!_.isEmpty(userSave) && !_.isNull(userSave)) {
                        
                        // let emailData = {
                        //     site_logo_url: process.env.PUBLIC_PATH + "/assets/media/logos/Iconic-logo.png",
                        //     user: userSave.first_name,
                        //     password: original_psw
                        // };
                        
                        // let sendMail = await mailer.sendMail(`${process.env.APP_NAME}<${process.env.MAIL_USERNAME}>`, userSave.email, 'Account Created', 'user-signup-web', emailData);
                            

                        // var usrData = await userRepo.getUserDetailById(userSave._id);
                        
                        return { status: 200, data: userSave, message: "Account created successfully!" };
                        
                    }
                    else{
                        return { status: 201, data: {}, message: "Something went wrong!" };
                    }                
                      
            }         
            
        } catch (e) {
            await helper.storeError({ "api_url": "api/user/signup", "error_msg": e.message });
            return { status: 500, data: {}, message: e.message };
        }
    }

    /*
     * /@Method: login
     * /@Description:User Login
    */
    async login(req, res) {
        try {
            if (!_.has(req.body, 'email') || (_.has(req.body, 'email') && req.body.email.trim() == "")) {
                return { "status": 201, data: {}, "message": "Please enter your email." };
            }
            if (!_.has(req.body, 'password') || (_.has(req.body, 'password') && req.body.password.trim() == "")) {
                return { "status": 201, data: {}, "message": "Please enter your password." };
            }
            let userData = await userRepo.getUserByField({ "email": req.body.email.trim().toLowerCase(), "isDeleted": false });
            if (!_.isEmpty(userData) && !_.isNull(userData)) {
                
                if (userData.role.role == 'user') {
                    let isPasswordMatched = User.validPassword(req.body.password, userData.password);
                    if (!isPasswordMatched) {
                        return { status: 201, data: {}, message: 'Authentication failed!' };
                    } else {
                        if(userData.isActive==true){
                            let tokenKey = otp.generate(8, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

                        

                            if (!_.isEmpty(req.body.deviceToken) && !_.isNull(req.body.deviceToken) && !_.isEmpty(req.body.deviceType) && !_.isNull(req.body.deviceType)) {
                                await userRepo.updateById({
                                    deviceType: req.body.deviceType.toLowerCase(),
                                    deviceToken: req.body.deviceToken
                                }, userData._id);
                            }

                            const payload = {
                                id: userData._id,
                                token_key: tokenKey
                            };

                            let token = jwt.sign(payload, config.jwtSecret, {
                                expiresIn: config.jwt_expiresin
                            });
                        //    let updateLoginDateTime = await User.updateById({"last_login_date":Date.now()},mongoose.Types.ObjectId(userData._id))
                            return { "status": 200, "data": userData, "token": token, "message": "You have successfully logged in." };
                        }
                        else{
                            return { status: 201, data: {}, message: 'Your account is inactivated by admin' };
                        }
                    }
                } else {
                    return { status: 201, data: {}, message: 'You are not authorized to login.' };
                }
            }
            else{
                return { status: 201, data: {}, message: 'Sorry, we don\'t recognize this email.' };
            }
        } catch (e) {
            await helper.storeError({ "user_id": null, "api_url": "/api/user/login", "error_msg": e.message });
            return { status: 500, data: {}, message: e.message };
        }
    }

    
    
    
    /*
     * /@Method: getProfile
     * /@Description: Get Profile
    */
    async getProfile(req, res) {
        try {
            var logged_in_userid = req.user._id;
            var userInfo = await userRepo.getById(logged_in_userid);
            if (!_.isEmpty(userInfo) && !_.isNull(userInfo)) {
                return { status: 200, data: userInfo, message: 'User profile fetched!' };                
            }
            else{
                return { status: 201, data: {}, message: 'Something went wrong!' };
            }
        } catch (e) {
            await helper.storeError({ "user_id": null, "api_url": "api/user/profile/get", "error_msg": e.message });
            return { status: 500, data: {}, message: e.message };
        }
    }

    /**
     * @Method updateProfile
     * @Description Update profile
    */

    async updateProfile(req, res) {
        try {
          
            let logged_in_user = req.user._id;
            if ((_.has(req.body, 'first_name') && req.body.first_name.trim() == "")) {
                return { status: 201, data: {}, message: "First name is required." };
            }
            else if ((_.has(req.body, 'last_name') && req.body.last_name.trim() == "")) {
                return { status: 201, data: {}, message: "Last name is required." };
            }
            else if (_.has(req.body, 'user_type') && (_.isUndefined(req.body.user_type) || _.isNull(req.body.user_type) || _.isEmpty(req.body.user_type))) {
                return { "status": 201, data: {}, "message": "User Type is required" };
            } 
            else if (_.has(req.body, 'email') && (_.isUndefined(req.body.email) || _.isNull(req.body.email) || _.isEmpty(req.body.email))) {
                return { "status": 201, data: {}, "message": "Email is required" };
            } 
            else if(_.has(req.body, 'phone') && (_.isUndefined(req.body.phone) || _.isNull(req.body.phone) || _.isEmpty(req.body.phone))) {
                return { "status": 201, data: {}, "message": "Phone is required" };
            }                           
            else{           
            if (_.has(req.body, 'email') && req.body.email.trim() != '') {
                let emailExists = await userRepo.getByField({ "email": req.body.email.trim().toLowerCase(), "isDeleted": false, "_id": { $ne: logged_in_user } });
                if (!_.isEmpty(emailExists)) {
                    return {
                        status: 201,
                        data: {},
                        message: 'Another user already registered with this email!'
                    }
                }
            }
            if (_.has(req.body, 'phone') && req.body.phone.trim() != '') {
                let phoneExists = await userRepo.getByField({"phone": req.body.phone.trim(), "isDeleted": false, "_id": { $ne: logged_in_user } });
                if (!_.isEmpty(phoneExists)) {
                    return {
                        status: 201,
                        data: {},
                        message: 'Another user already registered with this phone!'
                    }
                }
            }
            var updObj = {
                "first_name":req.body.first_name,
                "last_name":req.body.last_name,
                "user_type":req.body.user_type,
                "phone":req.body.address,
                "email" :req.body.email,
            }

            const userProfileUpdate = await userRepo.updateById(updObj, logged_in_user);
            if (!_.isEmpty(userProfileUpdate) && !_.isNull(userProfileUpdate)) {

                var usrData = await userRepo.getUserDetailById(userProfileUpdate._id);
                return { status: 200, data: usrData, message: 'Profile updated successfully!' }
            } else {
                return { status: 201, data: {}, message: 'We are unable to update the profile, please try again.' }
            }}
        } catch (e) {
            await helper.storeError({ "user_id":null, "api_url": "api/user/profile/update", "error_msg": e.message })
            return { status: 500, data: {}, message: e.message }
        }
    }
    /*
    // @Method: forgetPassword
    // @Description: User Forget Password Request
    */
    async forgetPassword(req, res) {
        try {

            if (!_.has(req.body, 'username') || (_.has(req.body, 'username') && (_.isUndefined(req.body.username) || _.isNull(req.body.username) || _.isEmpty(req.body.username)))) {
                return { status: 201, data: {}, message: 'Email or phone is required!' };
            } else {
                req.body.username = req.body.username.trim().toLowerCase();
                
                var userData = await userRepo.getUserByField({
                    $and: [
                        {   
                            $or : [
                                {
                                    "email": req.body.username.trim().toLowerCase()
                                },
                                {
                                    "phone": req.body.username.trim()
                                }
                            ]
                        },
                        {
                            "isDeleted": false
                        }
                    ]
                });
           
                if (_.isObject(userData)) {
                    if (userData.isActive == false) {
                        return { status: 201, data: {}, message: 'Your account is inactive!' };
                    } else {
                        let random_pass = otp.generate(8, { digits: true, lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: true });
                        
                        let readable_pass = random_pass;
                        random_pass = User.generateHash(random_pass.toString());
                    
                        let user_details = await userRepo.updateById({ password: random_pass }, userData._id);

                        let emailData = {
                            "site_logo_url":process.env.PUBLIC_PATH+"/assets/media/logos/Iconic-logo.png",
                            "name": userData.first_name,
                            "password": readable_pass
                        };
                        
                        let sendMail = await mailer.sendMail(`${process.env.APP_NAME}<${process.env.MAIL_USERNAME}>`, userData.email, 'Forgot Password', 'user-forgot-password', emailData);                       

                        return { status: 200, data: { "email": userData.email }, message: 'New password sent to your email!' };
                    }
                } else {
                    return { status: 201, data: {}, message: 'No account found!' };
                }
            }
        } catch (e) {
            await helper.storeError({ "api_url": "api/user/forgot/password", "error_msg": e.message })
            return { status: 500, message: e.message };
        }
    };
  
    
  
   /*
    // @Method: changePassword
    // @Description: User Change Password
    */
    async changePassword(req, res) {
        try {
            let logged_in_user = req.user._id;
            let userDetail = await userRepo.getById(logged_in_user);
            if (!_.has(req.body, 'old_password') || (_.has(req.body, 'old_password') && (_.isUndefined(req.body.old_password) || _.isNull(req.body.old_password) || _.isEmpty(req.body.old_password.trim())))) {
                return { status: 201, data: {}, message: 'Old password is required!' };
            }
            if (!_.has(req.body, 'password') || (_.has(req.body, 'password') && (_.isUndefined(req.body.password) || _.isNull(req.body.password) || _.isEmpty(req.body.password.trim())))) {
                return { status: 201, data: {}, message: 'New password is required!' };
            } 

            let isPasswordMatched = User.validPassword(req.body.old_password, userDetail.password);
            
            if (!isPasswordMatched) {
                return { status: 201, data: {}, message: 'Old password is incorrect!' };

            } else {
                if (User.validPassword(req.body.password, userDetail.password)) {
                    return { status: 201, data: {}, message: 'Old password and new password cannot be same!' };
                }

                let newPassword = User.generateHash(req.body.password);
                let updatedUser = await userRepo.updateById({ password: newPassword }, userDetail._id);
                if (updatedUser && updatedUser._id) {

                    var usrData = await userRepo.getUserDetailById(updatedUser._id);
                    
                    return { status: 200, data: usrData, message: 'Password changed successfully!' };
                } else {
                    return { status: 201, data: {}, message: 'Unable to update the password!' };
                }
            }
        } catch (e) {
            await helper.storeError({ "user_id": logged_in_user, "api_url": "api/user/change/password", "error_msg": e.message });
            return { status: 500, data: {}, "message": e.message };
        }
    };
    
}
module.exports = new UserController();