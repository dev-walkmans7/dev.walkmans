const express = require("express");
const routeLlabel = require("route-label");
const router = express.Router();
const { requireSignIn } = require("../middlewares/middleware.js");

const profileController = require("../controller/profileController.js");

/**
 * @api {post} /profile/update-profile Update Profile
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam {string} type Type of updation
 * @apiSuccessExample {json} Success
*{
    "data": {
        "_id": "65b7f99fb7b99419ddd2f133",
        "full_name": "Aritra Dutta",
        "email": "aritrababi2002@gmail.com",
        "phone": "",
        "password": "$2b$08$.JsRSGLox9C/FaqKJLek8Ov1/5T.XrvBt27kbfyHltyrbvffgeYkK",
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
        "timeStampOTP": "",
        "emailOTP": "",
        "isEmailVerified": false,
        "isTwoFactorEnaled": false,
        "isProfileComplete": false,
        "isActive": true,
        "isDeleted": false,
        "bio": {
            "full_name": "Aritra Dutta",
            "headline": "This is headline",
            "highlight": "This is Highlight",
            "_id": "65b7f99fb7b99419ddd2f132"
        },
        "about": "This is about",
        "skills": [
            "JavaScript",
            "C++",
            "Python"
        ],
        "experience": [
            {
                "title": "Software Developer",
                "company": "Google",
                "location": "Bangalore",
                "startDate": "22/03/2022",
                "endDate": "Present",
                "image": "www.google.com/image1",
                "_id": "65b7f9f9b7b99419ddd2f13a"
            }
        ],
        "project": [],
        "createdAt": "2024-01-29T19:16:47.563Z",
        "updatedAt": "2024-01-29T19:28:21.420Z"
    },
    "message": "Skills Updated"
}
*/
router.post(
  "/profile/update/profile",
  requireSignIn,
  profileController.updateProfile
);

router.get("/profile/get/profile", requireSignIn, profileController.getProfile);

// router.post("/profile/test", requireSignIn, profileController.test);

module.exports = router;
