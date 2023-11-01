const mongoose = require('mongoose');
const User = require('user/models/user.model');
const userRepo = require('user/repositories/user.repository');
// const serviceRepo = require('service/repositories/service.repository');
const roleRepo = require('role/repositories/role.repository');
const mailer = require('../../../helper/mailer.js');
const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const gm = require('gm').subClass({
    imageMagick: true
});
const fs = require('fs');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const otpGenerator = require('otp-generator')

//mail send 

class UserController {
    constructor() {
        this.users = [];

    }

    /* @Method: login
    // @Description: user Login Render
    */
    async login(req, res) {
        res.render('user/views/login.ejs');
    };

    /* @Method: signin
    // @Description: user Login
    */
    async signin(req, res) {
        try {
                        
            if(!_.has(req.body,'username') || (_.has(req.body,'username') && req.body.username=='')){
                return res.status(201).send({ success:false, data: {}, message: 'Email or Phone is required' });
            }
            if(!_.has(req.body,'password') || (_.has(req.body,'password') && req.body.password=='')){
                return res.status(201).send({ success:false, data: {}, message: 'Password is required' });
            }
            
            let userData = await userRepo.fineOneWithRole(req.body);
            
            if (userData.status == 500) {
                // req.flash('error', userData.message);
                // return res.redirect(namedRouter.urlFor('user.login'));
                return res.status(201).send({ success:false, data: {}, message: userData.message });
            }
            let user = userData.data;
            
            if (!_.isEmpty(user.role) && (user.role.role == 'admin' || user.role.role == 'super_admin' || user.role.role == 'contributor')) {
                const payload = {
                    id: user._id
                };

                let token = jwt.sign(payload, config.jwtSecret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                req.session.token = token;
                
                req.user = user;
                if(user.profile_pic!=''){
                    req.user.profile_img_url = "/uploads/user/profile_pic/"+user.profile_pic;
                }
                else{
                    req.user.profile_img_url = "/uploads/no-image.png";
                }
                let user_details = {};
                user_details.id = user._id;
                user_details.name = user.full_name;
                user_details.email = user.email;

                // return the information including token as JSON

                req.flash('success', "You have successfully logged in");
                // res.redirect(namedRouter.urlFor('user.dashboard'));
                return res.status(200).send({ success:true, data: {}, message: "You have successfully logged in." });
            } else {
                // req.flash('error', 'Authentication failed. You are not a valid user.');
                // res.redirect(namedRouter.urlFor('user.login'));
                return res.status(201).send({ success:false, data: {}, message: "Authentication failed. Please try again." });
            }

        } catch (e) {
            console.log(e.message);
            return res.status(201).send({ success:false, data: {}, message: e.message });
            // req.flash('error', e.message);
            // res.redirect(namedRouter.urlFor('user.login'));
            // throw e;
        }
    };

    /*
    // @Method: forgotPassword
    // @Description: User forgotPassword
    */

    async forgotPassword(req, res) {
        try {
            
            req.body.username = req.body.username.trim();
            if(!_.has(req.body,'username') || (_.has(req.body,'username') && req.body.username=='')){
                return res.status(201).send({ success:false, data: {}, message: 'Email or Phone is required' });
            }

            req.body.username = req.body.username.trim().toLowerCase().toString();
            let roleDetails = await roleRepo.getByField({ role: "admin" });
            let result = {};

            req.body.role_id = roleDetails._id;
            var userData = await userRepo.checkValidUserName(req.body);

            if (_.isNull(userData)) {

                return res.status(201).send({ success:false, data: {}, message: 'Incorrect email or phone' });
                // req.flash('error', "User not found");
                // res.redirect(namedRouter.urlFor('user.login'));
            } else {
                
                // let random_pass = utils.betweenRandomNumber(10000000, 99999999)
                let random_pass = otpGenerator.generate(8, { upperCaseAlphabets: false, specialChars: false });

                let readable_pass = random_pass;
                random_pass = new User().generateHash(random_pass.toString());
               
                let user_details = await userRepo.updateById({ password: random_pass }, userData._id);

                let emailData = {
                    "site_logo_url":process.env.PUBLIC_PATH+"/assets/media/logos/Logo_maidmo.jpg",
                    "name": userData.first_name,
                    "password": readable_pass
                };

                let sendMail = await mailer.sendMail(`${process.env.APP_NAME}<${process.env.MAIL_USERNAME}>`, userData.email, 'Reset Password', 'admin-user-change-password', emailData);

                if(sendMail){
                    return res.status(200).send({ "success":true, "data": {}, "message": "New password has been sent to your email." });
                }
                else{
                    return res.status(201).send({ "success":false, "data": {}, "message": "Please try after some time" });
                }
            }

        } catch (e) {
            req.flash('error', e.message);
            res.redirect(namedRouter.urlFor('user.login'));
        }
    };


    /* @Method: Dashboard
    // @Description: User Dashboard
    */
    async dashboard(req, res) {

        try {

            let user = await userRepo.getLimitUserByField({
                'isDeleted': false,
                'role.role': 'admin'||'super admin'||'contributor'
            });
            

            let user_role = await roleRepo.getByField({ "role": "user" });
            let userCount = 0;
            
            let totUserCount = await userRepo.getCount({"role":user_role._id, "isDeleted":false});
            let totActiveUserCount = await userRepo.getCount({"role":user_role._id, "isActive":true, "isDeleted":false});
            let totInactiveUserCount = await userRepo.getCount({"role":user_role._id, "isActive":false, "isDeleted":false});

            // let totServiceCount = await serviceRepo.getCount({"isDeleted":false});
            // let totActiveServiceCount = await serviceRepo.getCount({"status":"Active", "isDeleted":false});
            // let totInactiveServiceCount = await serviceRepo.getCount({"status":"Inactive", "isDeleted":false});

                        

            let resultall = {
                "user": user,                
                "totUserCount": totUserCount,
                "totActiveUserCount": totActiveUserCount,
                "totInactiveUserCount": totInactiveUserCount,
                "totServiceCount": totServiceCount,
                "totActiveServiceCount":totActiveServiceCount,
                "totInactiveServiceCount":totInactiveServiceCount
            };

            /* Html render here */
            res.render('user/views/dashboard.ejs', {
                page_name: 'user-dashboard',
                page_title: 'Dashboard',
                user: req.user,                
                response: resultall
            });
        } catch (e) {
            throw (e);
            //return res.status(500).send({message: e.message}); 
        }
    };



    /* @Method: Logout
    // @Description: User Logout
    */
    async logout(req, res) {
        req.session.destroy(function (err) {
            res.redirect('/' + process.env.ADMIN_FOLDER_NAME);
        });
        // req.session.token = "";
        // req.session.destroy();
        // return res.redirect('/');
    };

    /* @Method: viewmyprofile
    // @Description: To get Profile Info from db
    */
    async viewmyprofile(req, res) {
        try {
            var loggedin_user_id = req.user._id;
            let user = await userRepo.getById(loggedin_user_id)
            if (!_.isEmpty(user)) {
                res.render('user/views/myprofile.ejs', {
                    page_name: 'user-profile',
                    page_title: 'My Profile',
                    user: req.user,
                    response: user
                });
            }
        } catch (e) {

            return res.status(500).send({
                message: e.message
            });
        }
    }

    /* @Method: updateProfile
    // @Description: Update My Profile 
    */
    async updateProfile(req, res) {
        try {
            if(!_.has(req.body,'first_name') || (_.has(req.body,'first_name') && (_.isEmpty(req.body.first_name) || _.isNull(req.body.first_name) || _.isUndefined(req.body.first_name)))){
                req.flash('error', "First name is required");
                res.redirect(namedRouter.urlFor('admin.profile'));
            }
            else if(!_.has(req.body,'last_name') || (_.has(req.body,'last_name') && (_.isEmpty(req.body.last_name) || _.isNull(req.body.last_name) || _.isUndefined(req.body.last_name)))){
                req.flash('error', "Last name is required");
                res.redirect(namedRouter.urlFor('admin.profile'));
            }
            else if(!_.has(req.body,'email') || (_.has(req.body,'email') && (_.isEmpty(req.body.email) || _.isNull(req.body.email) || _.isUndefined(req.body.email)))){
                req.flash('error', "Email is required");
                res.redirect(namedRouter.urlFor('admin.profile'));
            }
            else if(!_.has(req.body,'phone') || (_.has(req.body,'phone') && (_.isEmpty(req.body.phone) || _.isNull(req.body.phone) || _.isUndefined(req.body.phone)))){
                req.flash('error', "Phone is required");
                res.redirect(namedRouter.urlFor('admin.profile'));
            }
            else{

                req.body.first_name = req.body.first_name.trim();
                req.body.last_name = req.body.last_name.trim();
                req.body.email = req.body.email.trim().toLowerCase();
                req.body.phone = req.body.phone.trim();

                if(req.body.first_name==''){
                    req.flash('error', "First name is required");
                    res.redirect(namedRouter.urlFor('admin.profile'));
                }
                else if(req.body.last_name==''){
                    req.flash('error', "Last name is required");
                    res.redirect(namedRouter.urlFor('admin.profile'));
                }
                else if(req.body.email==''){
                    req.flash('error', "Email is required");
                    res.redirect(namedRouter.urlFor('admin.profile'));
                }
                else if(req.body.phone==''){
                    req.flash('error', "Phone is required");
                    res.redirect(namedRouter.urlFor('admin.profile'));
                }
                else{

                    var loggedin_user_id = req.user._id;
                    let userInfo = await userRepo.getById(loggedin_user_id);
                    if(_.isEmpty(userInfo) || _.isNull(userInfo)){
                        req.flash('error', "Something went wrong. Please try later.");
                        res.redirect(namedRouter.urlFor('admin.profile'));
                    }
                    else{

                        let checkEmail = await userRepo.getByField({
                            "email": req.body.email,
                            "_id": { $ne: mongoose.Types.ObjectId(loggedin_user_id) },
                            "isDeleted": false
                        });

                        if(!_.isEmpty(checkEmail) && !_.isNull(checkEmail)){
                            req.flash('error', "Sorry, account already exist with this email.");
                            res.redirect(namedRouter.urlFor('admin.profile'));
                        }
                        else{

                            let checkPhone = await userRepo.getAllByField({
                                "phone": req.body.phone,
                                "_id": { $ne: mongoose.Types.ObjectId(loggedin_user_id) },
                                "isDeleted": false
                            });

                            if(!_.isEmpty(checkPhone) && !_.isNull(checkPhone)){
                                req.flash('error', "Sorry, account already exist with this phone.");
                                res.redirect(namedRouter.urlFor('admin.profile'));
                            }
                            else{

                                if(_.has(req,'files')){
                                    if (req.files.length>0) {
                                        if (fs.existsSync('./public/uploads/user/profile_pic/' + userInfo.profile_pic) && userInfo.profile_pic != '') {
                                            fs.unlinkSync('./public/uploads/user/profile_pic/' + userInfo.profile_pic);
                                        }
                                        if (fs.existsSync('./public/uploads/user/profile_pic/thumb/' + userInfo.profile_pic) && userInfo.profile_pic != '') {
                                            fs.unlinkSync('./public/uploads/user/profile_pic/thumb/' + userInfo.profile_pic);
                                        }
                                        gm('./public/uploads/user/profile_pic/' + req.files[0].filename).resize(200, 200, '!').write('./public/uploads/user/profile_pic/thumb/' + req.files[0].filename, function(err, result) {
                                            if (!err) console.log('done');
                                        });
                                        
                                        req.body.profile_pic = req.files[0].filename;
                                    }
                                }
                                let userUpdate = await userRepo.updateById(req.body, loggedin_user_id)
                                if (!_.isEmpty(userUpdate)) {
                                    req.flash('success', "Profile updated successfully.");
                                    res.redirect(namedRouter.urlFor('admin.profile'));
                                }
                                else{
                                    req.flash('error', "Something went wrong. Please try later.");
                                    res.redirect(namedRouter.urlFor('admin.profile'));
                                }
                            }                           
                            
                        }
                    }
                }
                
            }
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

    /*
    // @Method: userStatusChange
    // @Description: User status change action
    */
    async userStatusChange(req, res) {
        try {
            let user = await userRepo.getById(req.params.id);
            if (!_.isEmpty(user)) {
                let userStatus = (user.isActive == true) ? false : true;
                
                let userUpdate = await userRepo.updateById({
                    'isActive': userStatus
                }, req.params.id);

                req.flash('success', "Status changed successfully.");
                res.redirect(namedRouter.urlFor('user.list'));
            } else {
                req.flash('error', "Sorry user not found");
                res.redirect(namedRouter.urlFor('user.list'));
            }
        } catch (e) {
            console.log("admin user status change err: ",e.message);
            return res.status(500).send({
                message: e.message
            });
        }
    };

    /* @Method: changepassword
    // @Description: user changepassword Render
    */
    async adminChangePassword(req, res) {
        var vehicleOwner = await userRepo.getById(req.user._id);
        if (vehicleOwner) {
            res.render('user/views/change_password.ejs', {
                page_name: 'user-changepassword',
                page_title: 'Change Password',
                response: vehicleOwner,
                user: req.user
            });
        } else {
            req.flash('error', "sorry vehicle owner not found.");
            res.redirect(namedRouter.urlFor('user.dashboard'));
        }

    };

    /*
    // @Method: updatepassword
    // @Description: User password change
    */
    async adminUpdatePassword(req, res) {
        try {
            let user = await userRepo.getUserById(req.user._id);
            if (!_.isEmpty(user)) {
                // check if password matches
                if (!bcrypt.compareSync(req.body.old_password, user.password)) {
                    req.flash('error', "Sorry old password mismatch!");
                    res.redirect(namedRouter.urlFor('admin.changepassword'));
                } else {
                    if (req.body.password == req.body.password_confirm) {

                        if(bcrypt.compareSync(req.body.password, user.password)){
                            req.flash('error', "Old and current password cannot be same!");
                            res.redirect(namedRouter.urlFor('admin.changepassword'));
                        }
                        else{
                        
                            // if user is found and password is right, check if he is an admin
                            let new_password = req.user.generateHash(req.body.password);
                            let userUpdate = await userRepo.updateById({
                                "password": new_password
                            }, req.body.id);

                            if (userUpdate) {
                                req.session.token = "";
                                // req.session.destroy();
                                // return res.redirect('/');
                                req.flash('success', "Your password has been changed successfully.");
                                res.redirect(namedRouter.urlFor('user.login'));
                            }
                            else{
                                req.flash('error', "Unable to update at this moment.");
                                res.redirect(namedRouter.urlFor('admin.changepassword'));        
                            }
                        }
                    } else {
                        req.flash('error', "Your New Password And Confirm Password does not match.");
                        res.redirect(namedRouter.urlFor('admin.changepassword'));
                    }

                }
            } else {
                req.flash('error', "Authentication failed. Wrong credentials.");
                res.redirect(namedRouter.urlFor('admin.changepassword'));
            }
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

    async getAllUserCount(req, res) {
        try {
            let userCount = await userRepo.getUsersCount(req);
            return userCount;
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    }

    /* @Method: userList
    // @Description: To get all the user from DB
    */
    async userList(req, res) {
        try {

            let status = '';
            
            if(req.query.status){
                status = req.query.status
            }

            res.render('user/views/list.ejs', {
                page_name: 'user-management',
                page_title: 'User List',
                user: req.user,
                status: status
            });
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

    
    /* @Method: getAllUser
    // @Description: To get all the user from DB
    */
    async getAllUser(req, res) {
        try {           
            if (_.has(req.body, 'sort')) {
                var sortOrder = req.body.sort.sort;
                var sortField = req.body.sort.field;
            } else {
                var sortOrder = -1;
                var sortField = '_id';
            }

            if (!_.has(req.body, 'pagination')) {
                req.body.pagination.page = 1;
                eq.body.pagination.perpage = config.PAGINATION_PERPAGE
            }
            let user = await userRepo.getAllUsers(req);

            let meta = {
                "page": req.body.pagination.page,
                "pages": user.pages,
                "perpage": req.body.pagination.perpage,
                "total": user.total,
                "sort": sortOrder,
                "field": sortField
            };

            return {
                status: 200,
                meta: meta,
                data: user.docs,
                message: `Data fetched succesfully.`
            };
        } catch (e) {
            return {
                status: 500,
                data: [],
                message: e.message
            };
        }
    }

    /* @Method: addUser
    // @Description: user create view render
    */
    async addUser(req, res) {
        try {
            let success = {};
            let role = await roleRepo.getAllByField({ role : "user" });

            success.data = role;

            res.render('user/views/add.ejs', {
                page_name: 'user-management',
                page_title: 'User Add',
                user: req.user,
                response: success,
                role: role
            });
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };


    /* @Method: saveUser
    // @Description: Save user
    */

    async saveUser(req, res) {
        try {

            if(!_.has(req.body,'first_name') || (_.has(req.body,'first_name') && (_.isEmpty(req.body.first_name) || _.isNull(req.body.first_name) || _.isUndefined(req.body.first_name)))){
                req.flash('error', "First name is required");
                res.redirect(namedRouter.urlFor('user.add'));
            }
            else if(!_.has(req.body,'last_name') || (_.has(req.body,'last_name') && (_.isEmpty(req.body.last_name) || _.isNull(req.body.last_name) || _.isUndefined(req.body.last_name)))){
                req.flash('error', "Last name is required");
                res.redirect(namedRouter.urlFor('user.add'));
            }
            else if(!_.has(req.body,'email') || (_.has(req.body,'email') && (_.isEmpty(req.body.email) || _.isNull(req.body.email) || _.isUndefined(req.body.email)))){
                req.flash('error', "Email is required");
                res.redirect(namedRouter.urlFor('user.add'));
            }
            else if(!_.has(req.body,'phone') || (_.has(req.body,'phone') && (_.isEmpty(req.body.phone) || _.isNull(req.body.phone) || _.isUndefined(req.body.phone)))){
                req.flash('error', "Phone is required");
                res.redirect(namedRouter.urlFor('user.add'));
            }
            else if(!_.has(req.body,'password') || (_.has(req.body,'password') && (_.isEmpty(req.body.password) || _.isNull(req.body.password) || _.isUndefined(req.body.password)))){
                req.flash('error', "Password is required");
                res.redirect(namedRouter.urlFor('user.add'));
            }
            else if(!_.has(req.body,'address') || (_.has(req.body,'address') && (_.isEmpty(req.body.address) || _.isNull(req.body.address) || _.isUndefined(req.body.address)))){
                req.flash('error', "Address is required");
                res.redirect(namedRouter.urlFor('user.add'));
            }
            else{

                req.body.first_name = req.body.first_name.trim();
                req.body.last_name = req.body.last_name.trim();
                req.body.email = req.body.email.trim().toLowerCase();
                req.body.phone = req.body.phone.trim();
                req.body.password = req.body.password.trim();
                req.body.address = req.body.address.trim();

                if(req.body.first_name==''){
                    req.flash('error', "First name is required");
                    res.redirect(namedRouter.urlFor('user.add'));
                }
                else if(req.body.last_name==''){
                    req.flash('error', "Last name is required");
                    res.redirect(namedRouter.urlFor('user.add'));
                }
                else if(req.body.email==''){
                    req.flash('error', "Email is required");
                    res.redirect(namedRouter.urlFor('user.add'));
                }
                else if(req.body.phone==''){
                    req.flash('error', "Phone is required");
                    res.redirect(namedRouter.urlFor('user.add'));
                }
                else if(req.body.password==''){
                    req.flash('error', "Password is required");
                    res.redirect(namedRouter.urlFor('user.add'));
                }
                else if(req.body.address==''){
                    req.flash('error', "Address is required");
                    res.redirect(namedRouter.urlFor('user.add'));
                }
                else{

                    let checkEmail = await userRepo.getByField({
                        "email": req.body.email,
                        "isDeleted": false
                    });

                    if(!_.isEmpty(checkEmail) && !_.isNull(checkEmail)){
                        req.flash('error', "Sorry, account already exist with this email.");
                        res.redirect(namedRouter.urlFor('user.add'));
                    }
                    else{

                        let checkPhone = await userRepo.getAllByField({
                            "phone": req.body.phone,
                            "isDeleted": false
                        });

                        if(!_.isEmpty(checkPhone) && !_.isNull(checkPhone)){
                            req.flash('error', "Sorry, account already exist with this phone.");
                            res.redirect(namedRouter.urlFor('user.add'));
                        }
                        else{

                            const newUser = new User();
                            const readable_pass = req.body.password
                            req.body.password = newUser.generateHash(req.body.password);
                            
                                        
                            var roleDetails = await roleRepo.getByField({ role: "user" });

                            if (!_.isEmpty(roleDetails)) {
                                req.body.role = roleDetails._id;
                            } 

                            let saveUser = await userRepo.save(req.body);

                            if (_.isObject(saveUser) && saveUser._id) {

                                var local = {
                                    "name":saveUser.first_name,
                                    "email":saveUser.email,
                                    "password":readable_pass,
                                    "site_logo_url":process.env.PUBLIC_PATH+"/assets/media/logos/Logo_highlevel.jpg"
                                }
                                
                                let sendMail = await mailer.sendMail(`${process.env.APP_NAME}<${process.env.MAIL_USERNAME}>`, saveUser.email, 'Account Information | '+process.env.APP_NAME, 'user-add-notification', local);

                                req.flash('success', 'Account created successfully');
                                res.redirect(namedRouter.urlFor('user.list'));
                            } else {
                                req.flash('error', "Failed to create new account");
                                res.redirect(namedRouter.urlFor('user.list'));
                            }
                        }
                    }
                }
            }

        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    }

    /**
     * @Method: editUser
     * @Description: To edit user information
     */
    async editUser(req, res) {
        try {
            let result = {};
            let userData = await userRepo.getById(req.params.id);

            if (!_.isEmpty(userData)) {
                result.user_data = userData;
                res.render('user/views/edit.ejs', {
                    page_name: 'user-management',
                    page_title: 'User Edit',
                    user: req.user,
                    response: result
                });
            } else {
                req.flash('error', "Sorry user not found!");
                res.redirect(namedRouter.urlFor('user.list'));
            }
        } catch (e) {
            throw e;
        }
    };

    /* @Method: updateUser
    // @Description: Update user
    */
    async updateUser(req, res) {
        try {

            if (req.body.full_name && req.body.full_name != '') {
                const fullName = req.body.full_name;
                const [first_name, last_name] = fullName.split(' ');
                
                if(first_name && first_name != ''){
                    req.body.first_name = first_name
                }
                if(last_name && last_name != ''){
                    req.body.last_name = last_name
                }
            }

            let userUpdate = await userRepo.updateById(req.body, req.body.uid);

            if (userUpdate) {
                req.flash('success', 'User updated successfully.');
                res.redirect(namedRouter.urlFor('user.list'));
            } else {
                res.redirect(namedRouter.urlFor('user.edit', {
                    id: req.body.uid
                }));
            }
        } catch (e) {
            throw e;
        }
    };

    async deleteUser(req, res){
        try {
            let userDelete = await userRepo.updateById({
                "isDeleted": true
            }, req.params.id)
            if (!_.isEmpty(userDelete)) {
                req.flash('success', 'User removed successfully');
                res.redirect(namedRouter.urlFor('user.list'));
            }
            else{
                req.flash('error', 'Unable to remove!');
                res.redirect(namedRouter.urlFor('user.list'));
            }
        } catch (e) {
            return res.status(500).send({
                message: e.message
            })
        }
    };

    // Client

    /* @Method: clientList
    // @Description: To get all the user from DB
    */
    async clientList(req, res) {
        try {

            let status = '';
            
            if(req.query.status){
                status = req.query.status
            }

            res.render('user/views/client-list.ejs', {
                page_name: 'user-client-management',
                page_title: 'Client List',
                user: req.user,
                status: status
            });
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

    async clientView(req,res){
        try {

            let status = '';
            
            if(req.query.status){
                status = req.query.status
            }
            let data =await userRepo.getById(req.params.id);
        //    console.log(data);
            res.render('user/views/clientView.ejs', {
                page_name: 'user-client-management',
                page_title: 'Client View',
                user: req.user,
                status: status,
                data:data,
            });
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    }
    /* @Method: getAllClient
    // @Description: To get all the user from DB
    */
    async getAllClient(req, res) {
        try {        
            if (_.has(req.body, 'sort')) {
                var sortOrder = req.body.sort.sort;
                var sortField = req.body.sort.field;
            } else {
                var sortOrder = -1;
                var sortField = '_id';
            }

            if (!_.has(req.body, 'pagination')) {
                req.body.pagination.page = 1;
                eq.body.pagination.perpage = config.PAGINATION_PERPAGE
            }
            req.body.user_type = "client";
            let user = await userRepo.getAllUsers(req);
            let meta = {
                "page": req.body.pagination.page,
                "pages": user.pages,
                "perpage": req.body.pagination.perpage,
                "total": user.total,
                "sort": sortOrder,
                "field": sortField
            };

            return {
                status: 200,
                meta: meta,
                data: user.docs,
                message: `Data fetched succesfully.`
            };
        } catch (e) {
            return {
                status: 500,
                data: [],
                message: e.message
            };
        }
    }

/* @Method: addUserClient
    // @Description: userclient create view render
    */
    async addUserClient(req, res) {
        try {
            let success = {};
            let role = await roleRepo.getAllByField({ role : "user" });

            success.data = role;

            res.render('user/views/client-add.ejs', {
                page_name: 'user-client-management',
                page_title: 'Client Add',
                user: req.user,
                response: success,
                role: role
            });
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

   /* @Method: saveUser
    // @Description: Save user
    */

    async saveUserClient(req, res) {
        try {

            if(!_.has(req.body,'first_name') || (_.has(req.body,'first_name') && (_.isEmpty(req.body.first_name) || _.isNull(req.body.first_name) || _.isUndefined(req.body.first_name)))){
                req.flash('error', "First name is required");
                res.redirect(namedRouter.urlFor('user.client.add'));
            }
            else if(!_.has(req.body,'last_name') || (_.has(req.body,'last_name') && (_.isEmpty(req.body.last_name) || _.isNull(req.body.last_name) || _.isUndefined(req.body.last_name)))){
                req.flash('error', "Last name is required");
                res.redirect(namedRouter.urlFor('user.client.add'));
            }
            else if(!_.has(req.body,'email') || (_.has(req.body,'email') && (_.isEmpty(req.body.email) || _.isNull(req.body.email) || _.isUndefined(req.body.email)))){
                req.flash('error', "Email is required");
                res.redirect(namedRouter.urlFor('user.client.add'));
            }
            else if(!_.has(req.body,'phone') || (_.has(req.body,'phone') && (_.isEmpty(req.body.phone) || _.isNull(req.body.phone) || _.isUndefined(req.body.phone)))){
                req.flash('error', "Phone is required");
                res.redirect(namedRouter.urlFor('user.client.add'));
            }
            else if(!_.has(req.body,'password') || (_.has(req.body,'password') && (_.isEmpty(req.body.password) || _.isNull(req.body.password) || _.isUndefined(req.body.password)))){
                req.flash('error', "Password is required");
                res.redirect(namedRouter.urlFor('user.client.add'));
            }
            else if(!_.has(req.body,'address') || (_.has(req.body,'address') && (_.isEmpty(req.body.address) || _.isNull(req.body.address) || _.isUndefined(req.body.address)))){
                req.flash('error', "Address is required");
                res.redirect(namedRouter.urlFor('user.client.add'));
            }
            else{

                req.body.first_name = req.body.first_name.trim();
                req.body.last_name = req.body.last_name.trim();
                req.body.email = req.body.email.trim().toLowerCase();
                req.body.phone = req.body.phone.trim();
                req.body.password = req.body.password.trim();
                req.body.address = req.body.address.trim();
                if(req.body.first_name==''){
                    req.flash('error', "First name is required");
                    res.redirect(namedRouter.urlFor('user.client.add'));
                }
                else if(req.body.last_name==''){
                    req.flash('error', "Last name is required");
                    res.redirect(namedRouter.urlFor('user.client.add'));
                }
                else if(req.body.email==''){
                    req.flash('error', "Email is required");
                    res.redirect(namedRouter.urlFor('user.client.add'));
                }
                else if(req.body.phone==''){
                    req.flash('error', "Phone is required");
                    res.redirect(namedRouter.urlFor('user.client.add'));
                }
                else if(req.body.password==''){
                    req.flash('error', "Password is required");
                    res.redirect(namedRouter.urlFor('user.client.add'));
                }
                else if(req.body.address==''){
                    req.flash('error', "Address is required");
                    res.redirect(namedRouter.urlFor('user.client.add'));
                }
                else{

                    let checkEmail = await userRepo.getByField({
                        "email": req.body.email,
                        "isDeleted": false
                    });

                    if(!_.isEmpty(checkEmail) && !_.isNull(checkEmail)){
                        req.flash('error', "Sorry, account already exist with this email.");
                        res.redirect(namedRouter.urlFor('user.client.add'));
                    }
                    else{

                        let checkPhone = await userRepo.getAllByField({
                            "phone": req.body.phone,
                            "isDeleted": false
                        });

                        if(!_.isEmpty(checkPhone) && !_.isNull(checkPhone)){
                            req.flash('error', "Sorry, account already exist with this phone.");
                            res.redirect(namedRouter.urlFor('user.client.add'));
                        }
                        else{

                            const newUser = new User();
                            const readable_pass = req.body.password
                            req.body.password = newUser.generateHash(req.body.password);
                            
                                        
                            var roleDetails = await roleRepo.getByField({ role: "user" });

                            if (!_.isEmpty(roleDetails)) {
                                req.body.role = roleDetails._id;
                            } 

                            let saveUserCleaner = await userRepo.save(req.body);

                            if (_.isObject(saveUserCleaner) && saveUserCleaner._id) {

                                var local = {
                                    "name":saveUserCleaner.first_name,
                                    "email":saveUserCleaner.email,
                                    "password":readable_pass,
                                    "site_logo_url":process.env.PUBLIC_PATH+"/assets/media/logos/Logo_highlevel.jpg"
                                }
                                
                                let sendMail = await mailer.sendMail(`${process.env.APP_NAME}<${process.env.MAIL_USERNAME}>`, saveUserCleaner.email, 'Account Information | '+process.env.APP_NAME, 'user-add-notification', local);

                                req.flash('success', 'Account created successfully');
                                res.redirect(namedRouter.urlFor('user.client.list'));
                            } else {
                                req.flash('error', "Failed to create new account");
                                res.redirect(namedRouter.urlFor('user.client.list'));
                            }
                        }
                    }
                }
            }

        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    }

    /**
     * @Method: editUser
     * @Description: To edit user information
     */
    async editUserClient(req, res) {
        try {
            let result = {};
            let userData = await userRepo.getById(req.params.id);
            if (!_.isEmpty(userData)) {
                result.user_data = userData;
                res.render('user/views/client-edit.ejs', {
                    page_name: 'user-client-management',
                    page_title: 'Client Edit',
                    user: req.user,
                    response: result
                });
            } else {
                req.flash('error', "Sorry user not found!");
                res.redirect(namedRouter.urlFor('user.client.list'));
            }
        } catch (e) {
            throw e;
        }
    };
 /* @Method: updateUserClient
    // @Description: Update Client
    */
    async updateUserClient(req, res) {
        try {

            if (req.body.full_name && req.body.full_name != '') {
                const fullName = req.body.full_name;
                const [first_name, last_name] = fullName.split(' ');
                
                if(first_name && first_name != ''){
                    req.body.first_name = first_name
                }
                if(last_name && last_name != ''){
                    req.body.last_name = last_name
                }
            }

            let userUpdate = await userRepo.updateById(req.body, req.body.uid);
            if (userUpdate) {
                req.flash('success', 'Client updated successfully.');
                res.redirect(namedRouter.urlFor('user.client.list'));
            } else {
                res.redirect(namedRouter.urlFor('user.client.edit', {
                    id: req.body.uid
                }));
            }
        } catch (e) {
            throw e;
        }
    };

    /*
    // @Method: userStatusChange
    // @Description: User status change action
    */
    async userClientStatusChange(req, res) {
        try {
            let user = await userRepo.getById(req.params.id);
            if (!_.isEmpty(user)) {
                let userStatus = (user.isActive == true) ? false : true;
                
                let userUpdate = await userRepo.updateById({
                    'isActive': userStatus
                }, req.params.id);

                req.flash('success', "Status changed successfully.");
                res.redirect(namedRouter.urlFor('user.client.list'));
            } else {
                req.flash('error', "Sorry user not found");
                res.redirect(namedRouter.urlFor('user.client.list'));
            }
        } catch (e) {
            console.log("admin user status change err: ",e.message);
            return res.status(500).send({
                message: e.message
            });
        }
    };

/* @Method: deleteUserClient
    // @Description: Delete Client
    */
    async deleteUserClient(req, res){
        try {
            let userDelete = await userRepo.updateById({
                "isDeleted": true
            }, req.params.id)
            if (!_.isEmpty(userDelete)) {
                req.flash('success', 'Client removed successfully');
                res.redirect(namedRouter.urlFor('user.client.list'));
            }
            else{
                req.flash('error', 'Unable to remove!');
                res.redirect(namedRouter.urlFor('user.client.list'));
            }
        } catch (e) {
            return res.status(500).send({
                message: e.message
            })
        }
    };

async UserClientsendMail(req,res){
    try {  
        // console.log(req.body);
        let userclient_id=req.body.id;
        // console.log(userclient_id);
             let saveUserClient = await userRepo.getById(userclient_id);
            //  console.log(saveUserClient.email);

                 if (_.isObject(saveUserClient) && saveUserClient._id) {

                 var local = {
                    "email":saveUserClient.email,
                    "subject":req.body.subject,
                    "message":req.body.message,
                    "site_logo_url":process.env.PUBLIC_PATH+"/assets/media/logos/Logo_highlevel.jpg"
                            }
                            
                            let sendMail = await mailer.sendMail(`${req.body.subject} ${process.env.APP_NAME}<${process.env.MAIL_USERNAME}>`, saveUserClient.email,+process.env.APP_NAME, 'user-email-data-client', local);
                         console.log(sendMail);
                            req.flash('success', 'Mail send successfully');
                            res.redirect(namedRouter.urlFor('user.client.list'));
                        } else {
                            req.flash('error', "Failed to send mail");
                            res.redirect(namedRouter.urlFor('user.client.list'));
                        }
                    }
                catch (e) {
                return res.status(500).send({
                    message: e.message
                });
    }
}
    // Cleaner

    /* @Method: cleanerList
    // @Description: To get all the user from DB
    */
    async cleanerList(req, res) {
        try {

            let status = '';
            
            if(req.query.status){
                status = req.query.status
            }

            res.render('user/views/cleaner-list.ejs', {
                page_name: 'user-cleaner-management',
                page_title: 'Cleaner List',
                user: req.user,
                status: status
            });
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };


    async cleanerView(req,res){
        try {

            let status = '';
            
            if(req.query.status){
                status = req.query.status
            }
            let data =await userRepo.getById(req.params.id);
        //    console.log(data);
            res.render('user/views/cleanerView.ejs', {
                page_name: 'user-cleaner-management',
                page_title: 'Cleaner View',
                user: req.user,
                status: status,
                data:data,
            });
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    }










    
    /* @Method: getAllCleaner
    // @Description: To get all the user from DB
    */
    async getAllCleaner(req, res) {
        try {        
            if (_.has(req.body, 'sort')) {
                var sortOrder = req.body.sort.sort;
                var sortField = req.body.sort.field;
            } else {
                var sortOrder = -1;
                var sortField = '_id';
            }

            if (!_.has(req.body, 'pagination')) {
                req.body.pagination.page = 1;
                eq.body.pagination.perpage = config.PAGINATION_PERPAGE
            }
            req.body.user_type = "cleaner";
            let user = await userRepo.getAllUsers(req);

            let meta = {
                "page": req.body.pagination.page,
                "pages": user.pages,
                "perpage": req.body.pagination.perpage,
                "total": user.total,
                "sort": sortOrder,
                "field": sortField
            };

            return {
                status: 200,
                meta: meta,
                data: user.docs,
                message: `Data fetched succesfully.`
            };
        } catch (e) {
            return {
                status: 500,
                data: [],
                message: e.message
            };
        }
    }
    
/* @Method: addUserCleaner
    // @Description: userclient create view render
    */
    async addUserCleaner(req, res) {
        try {
            let success = {};
            let role = await roleRepo.getAllByField({ role : "user" });

            success.data = role;

            res.render('user/views/cleaner-add.ejs', {
                page_name: 'user-cleaner-management',
                page_title: 'Cleaner Add',
                user: req.user,
                response: success,
                role: role
            });
        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    };

   /* @Method: saveUserCleaner
    // @Description: Save Cleaner
    */

    async saveUserCleaner(req, res) {
        try {
            if(!_.has(req.body,'first_name') || (_.has(req.body,'first_name') && (_.isEmpty(req.body.first_name) || _.isNull(req.body.first_name) || _.isUndefined(req.body.first_name)))){
                req.flash('error', "First name is required");
                res.redirect(namedRouter.urlFor('user.client.add'));
            }
            else if(!_.has(req.body,'last_name') || (_.has(req.body,'last_name') && (_.isEmpty(req.body.last_name) || _.isNull(req.body.last_name) || _.isUndefined(req.body.last_name)))){
                req.flash('error', "Last name is required");
                res.redirect(namedRouter.urlFor('user.client.add'));
            }
            else if(!_.has(req.body,'email') || (_.has(req.body,'email') && (_.isEmpty(req.body.email) || _.isNull(req.body.email) || _.isUndefined(req.body.email)))){
                req.flash('error', "Email is required");
                res.redirect(namedRouter.urlFor('user.client.add'));
            }
            else if(!_.has(req.body,'phone') || (_.has(req.body,'phone') && (_.isEmpty(req.body.phone) || _.isNull(req.body.phone) || _.isUndefined(req.body.phone)))){
                req.flash('error', "Phone is required");
                res.redirect(namedRouter.urlFor('user.client.add'));
            }
            else if(!_.has(req.body,'password') || (_.has(req.body,'password') && (_.isEmpty(req.body.password) || _.isNull(req.body.password) || _.isUndefined(req.body.password)))){
                req.flash('error', "Password is required");
                res.redirect(namedRouter.urlFor('user.client.add'));
            }
            else if(!_.has(req.body,'address') || (_.has(req.body,'address') && (_.isEmpty(req.body.address) || _.isNull(req.body.address) || _.isUndefined(req.body.address)))){
                req.flash('error', "Address is required");
                res.redirect(namedRouter.urlFor('user.client.add'));
            }
            else{

                req.body.first_name = req.body.first_name.trim();
                req.body.last_name = req.body.last_name.trim();
                req.body.email = req.body.email.trim().toLowerCase();
                req.body.phone = req.body.phone.trim();
                req.body.password = req.body.password.trim();
                req.body.address = req.body.address.trim();
              
                if(req.body.first_name==''){
                    req.flash('error', "First name is required");
                    res.redirect(namedRouter.urlFor('user.cleaner.add'));
                }
                else if(req.body.last_name==''){
                    req.flash('error', "Last name is required");
                    res.redirect(namedRouter.urlFor('user.cleaner.add'));
                }
                else if(req.body.email==''){
                    req.flash('error', "Email is required");
                    res.redirect(namedRouter.urlFor('user.cleaner.add'));
                }
                else if(req.body.phone==''){
                    req.flash('error', "Phone is required");
                    res.redirect(namedRouter.urlFor('user.cleaner.add'));
                }
                else if(req.body.password==''){
                    req.flash('error', "Password is required");
                    res.redirect(namedRouter.urlFor('user.cleaner.add'));
                }
                else if(req.body.address==''){
                    req.flash('error', "Address is required");
                    res.redirect(namedRouter.urlFor('user.cleaner.add'));
                }
                else{

                    let checkEmail = await userRepo.getByField({
                        "email": req.body.email,
                        "isDeleted": false,
                    });

                    if(!_.isEmpty(checkEmail) && !_.isNull(checkEmail)){
                        req.flash('error', "Sorry, account already exist with this email.");
                        res.redirect(namedRouter.urlFor('user.cleaner.add'));
                    }
                    else{

                        let checkPhone = await userRepo.getAllByField({
                            "phone": req.body.phone,
                            "isDeleted": false
                        });

                        if(!_.isEmpty(checkPhone) && !_.isNull(checkPhone)){
                            req.flash('error', "Sorry, account already exist with this phone.");
                            res.redirect(namedRouter.urlFor('user.cleaner.add'));
                        }
                        else{

                            const newUser = new User();
                            const readable_pass = req.body.password
                            req.body.password = newUser.generateHash(req.body.password);
                            
                                        
                            var roleDetails = await roleRepo.getByField({ role: "user" });

                            if (!_.isEmpty(roleDetails)) {
                                req.body.role = roleDetails._id;
                            } 

                            let saveUserCleaner = await userRepo.save(req.body,req.body.user_type="cleaner");

                            if (_.isObject(saveUserCleaner) && saveUserCleaner._id) {

                                var local = {
                                    "name":saveUserCleaner.first_name,
                                    "email":saveUserCleaner.email,
                                    "password":readable_pass,
                                    "site_logo_url":process.env.PUBLIC_PATH+"/assets/media/logos/Logo_highlevel.jpg"
                                }
                                
                                let sendMail = await mailer.sendMail(`${process.env.APP_NAME}<${process.env.MAIL_USERNAME}>`, saveUserCleaner.email, 'Account Information | '+process.env.APP_NAME, 'user-add-notification', local);

                                req.flash('success', 'Account created successfully');
                                res.redirect(namedRouter.urlFor('user.cleaner.list'));
                            } else {
                                req.flash('error', "Failed to create new account");
                                res.redirect(namedRouter.urlFor('user.cleaner.list'));
                            }
                        }
                    }
                }
            }

        } catch (e) {
            return res.status(500).send({
                message: e.message
            });
        }
    }

    /**
     * @Method: editUser
     * @Description: To edit user information
     */
    async editUserCleaner(req, res) {
        try {
            let result = {};
            let userData = await userRepo.getById(req.params.id);
            if (!_.isEmpty(userData)) {
                result.user_data = userData;
                res.render('user/views/cleaner-edit.ejs', {
                    page_name: 'user-cleaner-management',
                    page_title: 'Cleaner Edit',
                    user: req.user,
                    response: result
                });
            } else {
                req.flash('error', "Sorry user not found!");
                res.redirect(namedRouter.urlFor('user.cleaner.list'));
            }
        } catch (e) {
            throw e;
        }
    };
 /* @Method: updateUserClient
    // @Description: Update Client
    */
    async updateUserCleaner(req, res) {
        try {

            if (req.body.full_name && req.body.full_name != '') {
                const fullName = req.body.full_name;
                const [first_name, last_name] = fullName.split(' ');
                
                if(first_name && first_name != ''){
                    req.body.first_name = first_name
                }
                if(last_name && last_name != ''){
                    req.body.last_name = last_name
                }
            }

            let userUpdate = await userRepo.updateById(req.body, req.body.uid);
            if (userUpdate) {
                req.flash('success', 'Cleaner updated successfully.');
                res.redirect(namedRouter.urlFor('user.cleaner.list'));
            } else {
                res.redirect(namedRouter.urlFor('user.cleaner.edit', {
                    id: req.body.uid
                }));
            }
        } catch (e) {
            throw e;
        }
    };
     /*
    // @Method: userStatusChange
    // @Description: User status change action
    */
    async userCleanerStatusChange(req, res) {
        try {
            let user = await userRepo.getById(req.params.id);
            if (!_.isEmpty(user)) {
                let userStatus = (user.isActive == true) ? false : true;
                
                let userUpdate = await userRepo.updateById({
                    'isActive': userStatus,
                }, req.params.id);

                req.flash('success', "Status changed successfully.");
                res.redirect(namedRouter.urlFor('user.cleaner.list'));
            } else {
                req.flash('error', "Sorry user not found");
                res.redirect(namedRouter.urlFor('user.cleaner.list'));
            }
        } catch (e) {
            console.log("admin user status change err: ",e.message);
            return res.status(500).send({
                message: e.message
            });
        }
    };

/* @Method: deleteUserClient
    // @Description: Delete Client
    */
    async deleteUserCleaner(req, res){
        try {
            let userDelete = await userRepo.updateById({
                "isDeleted": true
            }, req.params.id)
            if (!_.isEmpty(userDelete)) {
                req.flash('success', 'Cleaner removed successfully');
                res.redirect(namedRouter.urlFor('user.cleaner.list'));
            }
            else{
                req.flash('error', 'Unable to remove!');
                res.redirect(namedRouter.urlFor('user.cleaner.list'));
            }
        } catch (e) {
            return res.status(500).send({
                message: e.message
            })
        }
    };


    async UserCleanerMailsend(req,res){
        try {  
            console.log(req.body);
            let usercleaner_id=req.body.id;
            // console.log(userclient_id);
                 let saveUserCleaner = await userRepo.getById(usercleaner_id);
                 console.log(saveUserCleaner.email);
    
                     if (_.isObject(saveUserCleaner) && saveUserCleaner._id) {
    
                     var local = {
                        "email":saveUserCleaner.email,
                        "subject":req.body.subject,
                        "message":req.body.message,
                        "site_logo_url":process.env.PUBLIC_PATH+"/assets/media/logos/Logo_highlevel.jpg"
                                }
                                
                                let sendMail = await mailer.sendMail(`${req.body.subject} ${process.env.APP_NAME}<${process.env.MAIL_USERNAME}> `, saveUserCleaner.email, +process.env.APP_NAME, 'user-email-data-cleaner', local);
                               console.log(sendMail);
                                req.flash('success', 'Mail send successfully');
                                res.redirect(namedRouter.urlFor('user.cleaner.list'));
                            } else {
                                req.flash('error', "Failed to send mail");
                                res.redirect(namedRouter.urlFor('user.cleaner.list'));
                            }
                        }
                    catch (e) {
                    return res.status(500).send({
                        message: e.message
                    });
        }
    }









}

module.exports = new UserController();