const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const multer = require('multer');
const userController = require('webservice/user.controller');

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (file.fieldname === 'profile_pic') {
            callback(null, "./public/uploads/user/profile_pic")

        }
        else if (file.fieldname === 'resume') {
            callback(null, "./public/uploads/user/profile_pic")

        }
        else {
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
const request_param = multer()




/**
 * @api {post} /user/login Login
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam {string} email Email
 * @apiParam {string} password Password
 * @apiParam {string} deviceToken Device Token
 * @apiParam {string} deviceType Device Type [android / ios]
 * @apiSuccessExample {json} Success
*{
    "status": 200,
    "data": {
        "_id": "64904e03656fdf1dcd019738",
        "first_name": "Shyam",
        "last_name": "Dev",
        "full_name": "",
        "user_type": "cleaner",
        "email": "s@yopmail.com",
        "phone": "8596123693",
        "password": "$2b$08$jeE4bdYuKjAiHPKCBNKBr.5My1d6GE/NmZ5vnu51W5JcMjHzpkh2e",
        "address": "",
        "medical_license_number": "",
        "medical_license_file": "",
        "role": {
            "_id": "6479f0508844bf4c8c3ed95c",
            "roleDisplayName": "User",
            "role": "user",
            "rolegroup": "frontend",
            "desc": "User of the application.",
            "id": "6479f0508844bf4c8c3ed95c"
        },
        "profile_pic": "",
        "stripe_customer_id": "",
        "stripe_account_id": "",
        "inTrialPeriod": true,
        "isSubscribed": false,
        "social_id": "",
        "deviceType": "web",
        "deviceToken": "",
        "register_type": "normal",
        "emailOTP": "",
        "isEmailVerified": false,
        "isActive": true,
        "isDeleted": false,
        "createdAt": "2023-06-19T12:45:55.388Z",
        "updatedAt": "2023-06-19T12:45:55.388Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTA0ZTAzNjU2ZmRmMWRjZDAxOTczOCIsInRva2VuX2tleSI6Ijg5NDI1OTk2IiwiaWF0IjoxNjg3MTc4ODEzLCJleHAiOjE2ODc3ODM2MTN9.chTabl4uqWjqd8R59z3qMau6os4z2pvx1V4GLX8tw80",
    "message": "You have successfully logged in."
}
*/

namedRouter.post('api.user.login', '/user/login', request_param.any(), async (req, res) => {
    try {
        const success = await userController.login(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {post} /user/signup Signup
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam {string} first_name First Name
 * @apiParam {string} last_name Last Name
 * @apiParam {string} email Email
 * @apiParam {string} phone Phone
 * @apiParam {string} password Password
 * @apiParam {string} user_type User type (client/cleaner)
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "_id": "64904e03656fdf1dcd019738",
        "first_name": "Shyam",
        "last_name": "Dev",
        "user_type": "cleaner",
        "email": "s@yopmail.com",
        "phone": "8596123693"
    },
    "message": "Account created successfully!"
}
*/
namedRouter.post('api.user.signup', '/user/signup', uploadFile.any(), async (req, res) => {
    try {
        const success = await userController.signup(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});
/** 
 * @api {POST} /user/forgot/password Forgot Password
 * @apiGroup User
 * @apiParam {string} username Email or Phone
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "email": "s@yopmail.com"
    },
    "message": "New password sent to your email!"
}
*/
namedRouter.post('api.user.forgot.password', '/user/forgot/password', request_param.any(), async (req, res) => {
    try {
        const success = await userController.forgetPassword(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        // res.status(error.status).send(error);
         res.status(error.status).send(error);
    }
});
namedRouter.all('/user*',auth.authenticate);

/**
 * @api {get} /user/profile/get Get Profile
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiHeader x-access-token User Access Token
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": {
        "_id": "64904e03656fdf1dcd019738",
        "first_name": "Royan",
        "last_name": "Dev",
        "full_name": "",
        "user_type": "cleaner",
        "email": "s@yopmail.com",
        "phone": "8596123693",
        "password": "$2b$08$jeE4bdYuKjAiHPKCBNKBr.5My1d6GE/NmZ5vnu51W5JcMjHzpkh2e",
        "address": "",
        "medical_license_number": "",
        "medical_license_file": "",
        "role": "6479f0508844bf4c8c3ed95c",
        "profile_pic": "",
        "stripe_customer_id": "",
        "stripe_account_id": "",
        "inTrialPeriod": true,
        "isSubscribed": false,
        "social_id": "",
        "deviceType": "web",
        "deviceToken": "",
        "register_type": "normal",
        "emailOTP": "",
        "isEmailVerified": false,
        "isActive": false,
        "isDeleted": false,
        "createdAt": "2023-06-19T12:45:55.388Z",
        "updatedAt": "2023-06-20T06:52:28.549Z"
    },
    "message": "User profile fetched!"
}
*/

namedRouter.get("api.user.profile.get", '/user/profile/get',request_param.any(), async (req, res) => {
    try {
        const success = await userController.getProfile(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});

/**
 * @api {put} /user/profile/update Update Profile
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiHeader x-access-token User's Access token
 * @apiParam {string} first_name First Name
 * @apiParam {string} last_name Last Name
 * @apiParam {string} user_type User type (cleaner/client)
 * @apiParam {string} email Email
 * @apiParam {string} phone Phone
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "_id": "64904e03656fdf1dcd019738",
        "first_name": "Royan",
        "last_name": "Dowry",
        "user_type": "client",
        "email": "s@yopmail.com",
        "phone": "8596123693"
    },
    "message": "Profile updated successfully!"
}
*/

namedRouter.put('api.user.profile.update', '/user/profile/update', uploadFile.any(), async (req, res) => {
    try {
        const success = await userController.updateProfile(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        console.log(error)
        res.status(error.status).send(error);
    }
});


/**
 * @api {put} /user/change/password Change Password
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam {string} old_password Old password
 * @apiParam {string} password New password
 * @apiHeader x-access-token User's Access token
 * @apiSuccessExample {json} Success
 *{
    "status": 200,
    "data": {},
    "message": "Password changed successfully!"
}
*/
namedRouter.put("api.user.change.password", '/user/change/password', request_param.any(), async (req, res) => {
    try {
        const success = await userController.changePassword(req, res);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error);
    }
});



module.exports = router