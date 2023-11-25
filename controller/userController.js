const mongoose = require("mongoose");
const otp = require("otp-generator");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const userModel = require("../model/userModel.js");
const userRepo = require("../repositories/userRepo.js");
const roleRepo = require("../repositories/roleRepo.js");
const config = require("../config/config.js");
const mailer = require("../helper/mailer.js");
const User = new userModel();

class userController {
  constructor() {}
  /*
   * /@Method: signup
   * /@Description:User Signup
   */
  async signup(req, res) {
    try {
      let { full_name, email, password } = req.body;

      //FULL NAME IS NOT PRESENT
      if (full_name == "" || full_name == null || full_name == undefined) {
        return res.status(201).send({
          data: {},
          message: "Please provide your Full Name",
        });
      }

      //EMAIL IS NOT PRESENT
      if (email == "" || email == null || email == undefined) {
        return res.status(201).send({
          data: {},
          message: "Please provide your Email Address",
        });
      }

      //PASSWORD IS NOT PRESENT
      if (password == "" || password == null || password == undefined) {
        return res.status(201).send({
          data: {},
          message: "Please provide your Password",
        });
      }

      //EVERYTHING IS PRESENT
      email = email.trim().toLowerCase();

      //IF EMAIL IS ALREADY REGISTERED
      let userExists = await userRepo.getByField({
        email: email,
        isDeleted: false,
      });

      if (userExists) {
        return res.status(201).send({
          data: {},
          message: "This Email is already Registered",
        });
      } else {
        //USER DOES NOT EXISTS
        var roleInfo = await roleRepo.getByField({
          role: "user",
          rolegroup: "frontend",
        });
      }
      let role = roleInfo._id;

      var readable_pass = password;
      password = User.generateHash(readable_pass);

      let savedUser = await userRepo.save({ full_name, email, password, role });

      if (savedUser) {
        return res.status(200).send({
          data: savedUser,
          message: "You have been registered successfully",
        });
      }
    } catch (error) {
      return res.status(500).send({
        data: {},
        message: error.message,
      });
    }
  }

  /*
   * /@Method: login
   * /@Description:User Login
   */
  async login(req, res) {
    try {
      let { email, password } = req.body;

      //EMAIL IS NOT PRESENT
      if (email == "" || email == null || email == undefined) {
        return res.status(201).send({
          data: {},
          message: "Please provide your Email Address",
        });
      }

      //PASSWORD IS NOT PRESENT
      if (password == "" || password == null || password == undefined) {
        return res.status(201).send({
          data: {},
          message: "Please provide your Password",
        });
      }
      // console.log(req.body);
      // console.log(password);
      // console.log(userData);

      const userData = await userRepo.getUserByField({
        email: email.trim(),
        isDeleted: false,
      });
      // console.log(typeof password);
      if (userData) {
        if (userData.role.role == "user") {
          let isPasswordMatched = User.validPassword(
            password,
            userData.password
          );

          if (!isPasswordMatched) {
            return res.status(201).send({
              data: {},
              message: "Passwords Do Not Match!",
            });
          } else {
            if (userData.isActive == true) {
              let tokenKey = otp.generate(8, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
              });

              // if (
              //   req.body.deviceToken !== "" &&
              //   req.body.deviceToken !== null &&
              //   req.body.deviceToken !== null &&
              //   req.body.deviceType !== "" &&
              //   req.body.deviceType !== null
              // ) {
              //   await userRepo.updateById(
              //     {
              //       deviceToken: req.body.deviceToken,
              //       deviceType: req.body.deviceType.toLowerCase(),
              //     },
              //     userData._id
              //   );
              // }
              if (
                !_.isEmpty(req.body.deviceToken) &&
                !_.isNull(req.body.deviceToken) &&
                !_.isEmpty(req.body.deviceType) &&
                !_.isNull(req.body.deviceType)
              ) {
                await userRepo.updateById(
                  {
                    deviceType: req.body.deviceType.toLowerCase(),
                    deviceToken: req.body.deviceToken,
                  },
                  userData._id
                );
              }

              const payload = {
                id: userData._id,
                token_key: tokenKey,
              };

              let token = jwt.sign(payload, config.jwtSecret, {
                expiresIn: config.jwt_expiresin,
              });

              return res.status(200).send({
                data: userData,
                token: token,
                message: "You have successfully Logged in!",
              });
            } else {
              return res.status(201).send({
                data: {},
                message: "Account is deactivated!",
              });
            }
          }
        } else {
          return res.status(201).send({
            data: {},
            message: "You are not authorized to log in!",
          });
        }
      } else {
        return res.status(201).send({
          data: {},
          message: "Email is not registered!",
        });
      }
    } catch (error) {
      return res.status(500).send({
        data: {},
        message: error.message,
      });
    }
  }

  /*
    // @Method: forgetPassword
    // @Description: User Forget Password Request
    */
  async forgotPassword(req, res) {
    try {
      let { email, OTP } = req.body;

      //EMAIL IS NOT PRESENT
      if (email == "" || email == null || email == undefined) {
        return res.status(201).send({
          data: {},
          message: "Please provide your Email Address",
        });
      }

      email = email.trim().toLowerCase();
      var userData = await userRepo.getUserByField({
        $and: [
          {
            email: email,
          },
          {
            isDeleted: false,
          },
        ],
      });

      if (userData) {
        if (userData.isActive == false) {
          return res.status(201).send({
            data: {},
            message: "Your account is Inactive!",
          });
        } else {
          let emailotp = otp.generate(4, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
          });

          let readable_otp = emailotp;
          emailotp = User.generateHash(emailotp.toString());
          let user_details = await userRepo.updateById(
            {
              emailOTP: emailotp,
            },
            userData._id
          );

          let emailData = {
            site_logo_url:
              process.env.PUBLIC_PATH + "/assets/metia/logos/Iconic-logo.png",
            name: userData.full_name,
            OTP: readable_otp,
          };

          let sendMail = await mailer.sendMail(
            `${process.env.APP_NAME}<${process.env.MAIL_USERNAME}>`,
            userData.email,
            "Forgot Password",
            "user-forgot-password",
            emailData
          );

          return res.status(200).send({
            data: { email: userData.email },
            message: "OTP has been sent to your Email!",
          });
        }
      } else {
        return res.status(201).send({
          data: {},
          message: "No account found!",
        });
      }
    } catch (error) {
      return res.status(500).send({
        data: {},
        message: error.message,
      });
    }
  }

  /*
    // @Method: forgetPassword
    // @Description: User Forget Password Request
    */
  async validateOtp(req, res) {
    try {
      let { email, otp } = req.body;

      //EMAIL IS NOT PRESENT
      if (email == "" || email == null || email == undefined) {
        return res.status(201).send({
          data: {},
          message: "Please provide your Email Address",
        });
      }

      //OTP IS NOT PRESENT
      if (otp == "" || otp == null || otp == undefined) {
        return res.status(201).send({
          data: {},
          message: "Please provide your OTP",
        });
      }

      email = email.trim().toLowerCase();
      var userData = await userRepo.getUserByField({
        $and: [
          {
            email: email,
          },
          {
            isDeleted: false,
          },
        ],
      });

      if (userData) {
        if (userData.isActive == false) {
          return res.status(201).send({
            data: {},
            message: "Your account is Inactive!",
          });
        } else {
          let isOTPValid = User.validPassword(otp, userData.emailOTP);

          if (!isOTPValid) {
            return res.status(201).send({
              data: {},
              message: "OTP Does not match!",
            });
          } else {
            let user_details = await userRepo.updateById(
              { emailOTP: "" },
              userData._id
            );

            return res.status(200).send({
              data: { email: userData.email },
              message: "OTP Verified",
            });
          }
        }
      } else {
        return res.status(201).send({
          data: {},
          message: "No account found!",
        });
      }
    } catch (error) {
      return res.status(500).send({
        data: {},
        message: error.message,
      });
    }
  }

  /*
   * /@Method: changePassword
   * /@Description: User Change Password
   */
  async changePassword(req, res) {
    try {
      let { email, password } = req.body;
      //EMAIL IS NOT PRESENT
      if (email == "" || email == null || email == undefined) {
        return res.status(201).send({
          data: {},
          message: "Please provide your Email Address",
        });
      }

      //PASSWORD IS NOT PRESENT
      if (password == "" || password == null || password == undefined) {
        return res.status(201).send({
          data: {},
          message: "Please provide your Password",
        });
      }

      email = email.trim().toLowerCase();
      const userData = await userRepo.getUserByField({
        email: email,
        isDeleted: false,
      });

      if (userData) {
        // console.log(userData._id);
        if (userData.isActive == false) {
          return res.status(201).send({
            data: {},
            message: "Your account is inactive!",
          });
        } else {
          password = User.generateHash(password);
          // console.log(userData.full_name);
          let updatedUser = await userModel.findByIdAndUpdate(
            userData._id,
            { password: password },
            { new: true }
          );
          // console.log(updatedUser);
          if (updatedUser) {
            return res.status(200).send({
              data: {},
              message: "Password Reset Successful!",
            });
          } else {
            return res.status(201).send({
              data: {},
              message: "Something went wrong",
            });
          }
        }
      } else {
        return res.status(201).send({
          data: {},
          message: "Email is not registered!",
        });
      }
    } catch (error) {
      return res.status(500).send({
        data: {},
        message: error.message,
      });
    }
  }
}

module.exports = new userController();
