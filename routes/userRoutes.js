const express = require("express");
const routeLlabel = require("route-label");
const router = express.Router();
// const namedRouter = routeLlabel(router)
const userController = require("../controller/userController.js");

/**
 * @api {post} /user/signup Signup
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam {string} full_name Full Name
 * @apiParam {string} email Email
 * @apiParam {string} password Password
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    {
    "data": {
        "full_name": "Aritra Dutta",
        "email": "aritra@yopmail.com",
        "phone": "",
        "password": "$2b$08$02pW4W4Sg54HM7dzTHnNs..zQ3pKNdY88a3SN3YFqzkerfN/1wfd6",
        "country_code": "",
        "city": "",
        "country": "",
        "role": "652ae25facdb61ea735107be",
        "profile_pic": "",
        "social_id": "",
        "deviceToken": "",
        "register_type": "normal",
        "last_active": null,
        "last_login_date": null,
        "emailOTP": "",
        "isEmailVerified": false,
        "isTwoFactorEnaled": false,
        "isProfileComplete": false,
        "isActive": true,
        "isDeleted": false,
        "_id": "65609d108dbf366fab7b20cb",
        "createdAt": "2023-11-24T12:54:40.406Z",
        "updatedAt": "2023-11-24T12:54:40.406Z"
    },
    "message": "Account Creation is successful"
}
*/
router.post("/user/signup", userController.signup);

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
        "_id": "65609ee466371b4ff796d308",
        "full_name": "Aritra Dutta",
        "email": "aritra@yopmail.com",
        "phone": "",
        "password": "$2b$08$49KSnzbO6TL0sICxGYURLeV6FkQ/2tzP9iBxG3uKZVJOvEG7u5JzC",
        "country_code": "",
        "city": "",
        "country": "",
        "role": {
            "_id": "652ae25facdb61ea735107be",
            "role": "user",
            "rolegroup": "frontend",
            "desc": "for normal user's",
            "id": "652ae25facdb61ea735107be"
        },
        "profile_pic": "",
        "social_id": "",
        "deviceToken": "",
        "register_type": "normal",
        "last_active": null,
        "last_login_date": null,
        "emailOTP": "",
        "isEmailVerified": false,
        "isTwoFactorEnaled": false,
        "isProfileComplete": false,
        "isActive": true,
        "isDeleted": false,
        "createdAt": "2023-11-24T13:02:29.007Z",
        "updatedAt": "2023-11-24T13:02:29.007Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjA5ZWU0NjYzNzFiNGZmNzk2ZDMwOCIsInRva2VuX2tleSI6IjQ1MzQwNTc3IiwiaWF0IjoxNzAwODU4NjExLCJleHAiOjE3MDE0NjM0MTF9.ZpPg7FMbTiesQSQjsZX4UxOf4sJ14-GIliSsJTotlDc",
    "message": "You have successfully Logged in!"
}
*/
router.post("/user/login", userController.login);

/**
 * @api {post} /user/login Login
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam {string} email Email
 * @apiSuccessExample {json} Success
*{
    "status": 200,
    "data": {
        "email": "aritra@yopmail.com"
    },
    "message": "OTP has been sent to your Email!"
}
*/
router.post("/user/forgot/password", userController.forgotPassword);

router.post("/user/validate/otp", userController.validateOtp);

/**
 * @api {post} /user/login Login
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam {string} email Email
 * * @apiParam {string} password Password
 * @apiSuccessExample {json} Success
*{
    "status": 200,
    "data": {},
    "message": "Password Reset Successful!"
}
*/
router.post("/user/change/password", userController.changePassword);

router.post("/test", userController.test);

module.exports = router;
