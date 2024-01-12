const userModel = require("../model/userModel.js");
const userRepo = require("../repositories/userRepo.js");

const User = userModel();

class profileController {
  constructor() {}

  /*
   * /@Method: updateProfile
   * /@Description: Update Profile
   */
  async updateProfile(req, res) {
    try {
      if (
        req.body.type == "" ||
        req.body.type == null ||
        req.body.type == undefined
      ) {
        return res.status(201).send({
          data: {},
          message: "Something went wrong!!",
        });
      }
      var type;
      if (req.body.type == "bio") {
        type = 1;
      } else if (req.body.type == "about") {
        type = 2;
      } else if (req.body.type == "skills") {
        type = 3;
      } else if (req.body.type == "experience") {
        type = 4;
      } else if (req.body.type == "projects") {
        type = 5;
      } else {
        type = 6;
      }

      switch (type) {
        case 1:
          //FULL NAME MISSING
          if (
            req.body.full_name == "" ||
            req.body.full_name == null ||
            req.body.full_name == undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Please provide your full name!",
            });
          }

          //HEADLINE MISSING
          if (
            req.body.headline == "" ||
            req.body.headline == null ||
            req.body.headline == undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Please provide your headline!",
            });
          }

          //HIGHLIGHT MISSING
          if (
            req.body.highlight == "" ||
            req.body.highlight == null ||
            req.body.highlight == undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Please provide your highlight!",
            });
          }

          var userData = await userRepo.getById(req.user.id);

          if (userData) {
            let bio = {
              full_name: req.body.full_name,
              headline: req.body.headline,
              highlight: req.body.highlight,
            };
            let updatedUser = await userRepo.updateBio(
              bio,
              userData.bio._id,
              userData._id
            );

            if (updatedUser) {
              return res.status(200).send({
                data: updatedUser,
                message: "Bio updated Successfully",
              });
            }
          } else {
            return res.status(201).send({
              data: {},
              message: "No account found!",
            });
          }
          break;
        case 2:
          //ABOUT MISSING
          if (
            req.body.about == "" ||
            req.body.about == null ||
            req.body.about == undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Please provide your about section!",
            });
          }

          var userData = await userRepo.getById(req.user.id);
          // console.log(userData);

          if (userData) {
            let about = req.body.about.trim();
            let updatedUser = await userRepo.updateById(
              { about: about },
              userData._id
            );
            console.log(updatedUser);
            if (updatedUser) {
              return res.status(200).send({
                data: updatedUser,
                message: "About Updation Successful!",
              });
            } else {
              return res.status(201).send({
                data: {},
                message: "Something went wrong!",
              });
            }
          } else {
            return res.status(201).send({
              data: {},
              message: "No account found!",
            });
          }
          break;
        case 3:
          let skills = req.body.skills;

          if (skills.length == 0) {
            return res.status(201).send({
              data: {},
              message: "Skills cannot be empty",
            });
          }

          var userData = await userRepo.getById(req.user.id);

          if (userData) {
            let updatedUser = await userRepo.updateById(
              { skills: skills },
              userData._id
            );

            if (updatedUser) {
              return res.status(200).send({
                data: updatedUser,
                message: "Skills Updated",
              });
            } else {
              return res.status(201).send({
                data: {},
                message: "Something went wrong!",
              });
            }
          } else {
            return res.status(201).send({
              data: {},
              message: "User not found!",
            });
          }
          // console.log(skills);
          break;
        case 4:
          break;
        case 5:
          break;
        default:
          return res.status(201).send({
            data: {},
            message: "Wrong Type Provided!",
          });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        data: {},
        message: error.message,
      });
    }
  }
  // async test(req, res) {
  //   console.log(req.body);
  //   console.log(req.user.id);
  // }
}

module.exports = new profileController();
