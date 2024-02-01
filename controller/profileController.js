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
      } else if (req.body.type == "delete experience") {
        type = 6;
      } else if (req.body.type == "update experience") {
        type = 7;
      } else {
        type = 8;
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
            // console.log(updatedUser);
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
          let experience = req.body.experience;
          if (Object.keys(experience).length === 0) {
            return res.status(201).send({
              data: {},
              message: "Experience cannot be empty!",
            });
          }

          //TITLE IS BLANK
          if (
            experience.title === null ||
            experience.title === "" ||
            experience.title === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Title cannot be empty!",
            });
          }

          //COMPANY IS NOT PRESENT
          if (
            experience.company === null ||
            experience.company === "" ||
            experience.company === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Company cannot be empty!",
            });
          }

          //LOCATION IS NOT PRESENT
          if (
            experience.locatoin === null ||
            experience.location === "" ||
            experience.location === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Location cannot be empty!",
            });
          }

          //START DATE IS NOT PRESENT
          if (
            experience.startDate === null ||
            experience.startDate === "" ||
            experience.startDate === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Start Date cannot be empty!",
            });
          }
          //END DATE IS NOT PRESENT
          if (
            experience.endDate === null ||
            experience.endDate === "" ||
            experience.endDate === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "End Date cannot be empty!",
            });
          }

          if (
            experience.image === null ||
            experience.image === "" ||
            experience.image === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Image cannot be empty!",
            });
          }

          var userData = await userRepo.getById(req.user.id);

          if (Object.keys(userData).length === 0) {
            return res.status(201).send({
              data: {},
              message: "User not found!",
            });
          }
          let exp = userData.experience;
          exp = [...exp, experience];

          const updatedUser = await userRepo.updateById(
            { experience: exp },
            userData._id
          );

          if (updatedUser) {
            return res.status(200).send({
              data: updatedUser,
              message: "Experience updated!",
            });
          } else {
            return res.status(201).send({
              data: {},
              message: "Something went wrong!",
            });
          }

          break;
        case 5:
          break;
        case 6:
          if (
            req.body.expid === null ||
            req.body.expid === "" ||
            req.body.expid === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Something went wrong",
            });
          }

          let user = await userRepo.getById(req.user.id);

          if (Object.keys(user).length === 0) {
            return res.status(201).send({
              data: {},
              message: "User not found!",
            });
          }

          const update = {
            $pull: {
              experience: { _id: req.body.expid },
            },
          };

          const updatedUserDel = await userModel.updateOne(
            { _id: req.user.id },
            update
          );
          if (updatedUserDel) {
            return res.status(200).send({
              data: updatedUserDel,
              message: "Experience Deleted!",
            });
          }
          break;
        case 7:
          //EXPID NOT PRESENT
          if (
            req.body.expid === null ||
            req.body.expid === "" ||
            req.body.expid === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Something went wrong",
            });
          }

          let experienceUpdated = req.body.experience;
          if (Object.keys(experienceUpdated).length === 0) {
            return res.status(201).send({
              data: {},
              message: "Experience cannot be empty!",
            });
          }

          //TITLE IS BLANK
          if (
            experienceUpdated.title === null ||
            experienceUpdated.title === "" ||
            experienceUpdated.title === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Title cannot be empty!",
            });
          }

          //COMPANY IS NOT PRESENT
          if (
            experienceUpdated.company === null ||
            experienceUpdated.company === "" ||
            experienceUpdated.company === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Company cannot be empty!",
            });
          }

          //LOCATION IS NOT PRESENT
          if (
            experienceUpdated.locatoin === null ||
            experienceUpdated.location === "" ||
            experienceUpdated.location === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Location cannot be empty!",
            });
          }

          //START DATE IS NOT PRESENT
          if (
            experienceUpdated.startDate === null ||
            experienceUpdated.startDate === "" ||
            experienceUpdated.startDate === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Start Date cannot be empty!",
            });
          }
          //END DATE IS NOT PRESENT
          if (
            experienceUpdated.endDate === null ||
            experienceUpdated.endDate === "" ||
            experienceUpdated.endDate === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "End Date cannot be empty!",
            });
          }

          //IMAGE NOT PRESENT
          if (
            experienceUpdated.image === null ||
            experienceUpdated.image === "" ||
            experienceUpdated.image === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Image cannot be empty!",
            });
          }
          let userExpUpdate = await userRepo.getById(req.user.id);

          if (Object.keys(userExpUpdate).length === 0) {
            return res.status(201).send({
              data: {},
              message: "User not found!",
            });
          }

          const updateExp = {
            $set: {
              "experience.$.title": experienceUpdated.title,
              "experience.$.company": experienceUpdated.company,
              "experience.$.location": experienceUpdated.location,
              "experience.$.startDate": experienceUpdated.startDate,
              "experience.$.endDate": experienceUpdated.endDate,
              "experience.$.image": experienceUpdated.image,
            },
          };

          let updateUserExpUpdate = await userModel.updateOne(
            { _id: req.user.id, "experience._id": req.body.expid },
            updateExp
          );

          if (updateUserExpUpdate) {
            return res.status(200).send({
              data: updateUserExpUpdate,
              message: "Experience Updated!",
            });
          }

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

  async getExperience(req, res) {
    try {
      const userData = await userModel
        .findById(req.user.id)
        .select(
          "email bio about skills experience project profile_picture isProfileComplete"
        );

      if (Object.keys(userData).length === 0) {
        return res.status(201).send({
          data: {},
          message: "Something went wrong!",
        });
      }

      let completion = 20;

      if (userData.isProfileComplete === false) {
        //ABOUT PRESENT
        if (
          userData.about != null &&
          userData.about != "" &&
          userData.about != undefined
        ) {
          completion = completion + 20;
        }

        //SKILLS PRESENT
        if (userData.skills.length > 0) {
          completion = completion + 20;
        }

        //EXPERIENCE PRESENT
        if (userData.experience.length > 0) {
          completion = completion + 20;
        }

        // //PROJECTS PRESENT
        if (userData.project.length > 0) {
          completion = completion + 20;
        }
        if (completion === 100) {
          let updatedUser = await userRepo.updateById(
            { isProfileComplete: true },
            userData._id
          );

          if (!updatedUser) {
            res.status(201).send({
              data: {},
              message: "Something went wrong!",
            });
          }
        }
      } else {
        completion = 100;
      }

      res.status(200).send({
        data: {
          profile: userData,
          completion: completion,
        },
        message: "Here is your profile",
      });
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
