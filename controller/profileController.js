const userModel = require("../model/userModel.js");
const userRepo = require("../repositories/userRepo.js");

const User = userModel();

class profileController {
  constructor() {}
  //f
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
      } else if (req.body.type == "update experience") {
        type = 5;
      } else if (req.body.type == "delete experience") {
        type = 6;
      } else if (req.body.type == "project") {
        type = 7;
      } else if (req.body.type == "update project") {
        type = 8;
      } else if (req.body.type == "delete project") {
        type = 9;
      } else if (req.body.type == "profile picture") {
        type = 10;
      } else {
        type = 11;
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
        case 4: // Add New Experience
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

          // if (
          //   experience.image === null ||
          //   experience.image === "" ||
          //   experience.image === undefined
          // ) {
          //   return res.status(201).send({
          //     data: {},
          //     message: "Image cannot be empty!",
          //   });
          // }

          var image =
            "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?size=338&ext=jpg&ga=GA1.1.1700460183.1708128000&semt=ais";
          var fullExp = { ...experience, image: image };

          var userData = await userRepo.getById(req.user.id);

          if (Object.keys(userData).length === 0) {
            return res.status(201).send({
              data: {},
              message: "User not found!",
            });
          }
          let exp = userData.experience;
          exp = [...exp, fullExp];

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
        case 5: // Update Experience
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
          // if (
          //   experienceUpdated.image === null ||
          //   experienceUpdated.image === "" ||
          //   experienceUpdated.image === undefined
          // ) {
          //   return res.status(201).send({
          //     data: {},
          //     message: "Image cannot be empty!",
          //   });
          // }
          let userExpUpdate = await userRepo.getById(req.user.id);

          if (Object.keys(userExpUpdate).length === 0) {
            return res.status(201).send({
              data: {},
              message: "User not found!",
            });
          }
          var image =
            "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?size=338&ext=jpg&ga=GA1.1.1700460183.1708128000&semt=ais";
          var fullExp = { ...experienceUpdated, image: image };
          const updateExp = {
            $set: {
              "experience.$.title": fullExp.title,
              "experience.$.company": fullExp.company,
              "experience.$.location": fullExp.location,
              "experience.$.startDate": fullExp.startDate,
              "experience.$.endDate": fullExp.endDate,
              "experience.$.image": fullExp.image,
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
        case 6: // Delete Experience
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
        case 7: // Add New Projects
          let project = req.body.project;
          if (Object.keys(project).length === 0) {
            return res.status(201).send({
              data: {},
              message: "Project details cannot be empty!",
            });
          }

          // PROJECT TITLE IS BLANK
          if (
            project.project_title === null ||
            project.project_title === "" ||
            project.project_title === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Project title cannot be empty!",
            });
          }

          // SKILLS IS BLANK
          if (
            project.skills === null ||
            project.skills === "" ||
            project.skills === undefined ||
            project.skills.length === 0
          ) {
            return res.status(201).send({
              data: {},
              message: "Skills cannot be empty!",
            });
          }

          // PROJECT LINK IS BLANK
          if (
            project.project_link === null ||
            project.project_link === "" ||
            project.project_link === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Project link cannot be empty!",
            });
          }

          var userDataProject = await userRepo.getById(req.user.id);

          if (Object.keys(userDataProject).length === 0) {
            return res.status(201).send({
              data: {},
              message: "User not found!",
            });
          }

          let projects = userDataProject.project;
          projects = [...projects, project];

          const updatedUserProject = await userRepo.updateById(
            { project: projects },
            userDataProject._id
          );

          if (updatedUserProject) {
            return res.status(200).send({
              data: updatedUserProject,
              message: "New Project added successfully!",
            });
          } else {
            return res.status(201).send({
              data: {},
              message: "Something went wrong!",
            });
          }
          break;

        case 8: // Update Project
          // PROJECT ID NOT PRESENT
          if (
            req.body.project_id === null ||
            req.body.project_id === "" ||
            req.body.project_id === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Project ID not provided!",
            });
          }

          let projectUpdated = req.body.project;
          if (Object.keys(projectUpdated).length === 0) {
            return res.status(201).send({
              data: {},
              message: "Project details cannot be empty!",
            });
          }

          var userProjectUpdate = await userRepo.getById(req.user.id);

          if (Object.keys(userProjectUpdate).length === 0) {
            return res.status(201).send({
              data: {},
              message: "User not found!",
            });
          }

          const updateProject = {
            $set: {
              "project.$.project_title": projectUpdated.project_title,
              "project.$.skills": projectUpdated.skills,
              "project.$.project_link": projectUpdated.project_link,
            },
          };

          let updateUserProjectUpdate = await userModel.updateOne(
            { _id: req.user.id, "project._id": req.body.project_id },
            updateProject
          );

          if (updateUserProjectUpdate) {
            return res.status(200).send({
              data: updateUserProjectUpdate,
              message: "Project updated!",
            });
          }
          break;

        case 9: // Delete Project
          if (
            req.body.project_id === null ||
            req.body.project_id === "" ||
            req.body.project_id === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Project ID not provided!",
            });
          }

          let userDeleteProject = await userRepo.getById(req.user.id);

          if (Object.keys(userDeleteProject).length === 0) {
            return res.status(201).send({
              data: {},
              message: "User not found!",
            });
          }

          const updateDeleteProject = {
            $pull: {
              project: { _id: req.body.project_id },
            },
          };

          const updatedUserDeleteProject = await userModel.updateOne(
            { _id: req.user.id },
            updateDeleteProject
          );
          if (updatedUserDeleteProject) {
            return res.status(200).send({
              data: updatedUserDeleteProject,
              message: "Project Deleted!",
            });
          }
          break;

        case 10:
          //IMAGE LINK NOT PRESENT
          if (
            req.body.profile_picture === "" ||
            req.body.profile_picture === null ||
            req.body.profile_picture === undefined
          ) {
            return res.status(201).send({
              data: {},
              message: "Profile Picture is empty!!!",
            });
          }

          var userData = await userRepo.getById(req.user.id);
          if (Object.keys(userData).length === 0) {
            return res.status(201).send({
              data: {},
              message: "User not found!",
            });
          }

          let updatedUserDP = await userRepo.updateById(
            { profile_pic: req.body.profile_picture },
            userData._id
          );

          if (updatedUserDP) {
            return res.status(200).send({
              data: updatedUserDP,
              message: "Profile Picture Updated!",
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

  async getProfile(req, res) {
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
        // if (completion === 100) {
        //   let updatedUser = await userRepo.updateById(
        //     { isProfileComplete: true },
        //     userData._id
        //   );

        //   if (!updatedUser) {
        //     res.status(201).send({
        //       data: {},
        //       message: "Something went wrong!",
        //     });
        //   }
        // }
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

  // async getProject(req, res) {
  //     try {
  //         const userData = await userModel
  //             .findById(req.user.id)
  //             .select(
  //                 "email bio about skills experience project profile_picture isProfileComplete"
  //             );

  //         if (Object.keys(userData).length === 0) {
  //             return res.status(201).send({
  //                 data: {},
  //                 message: "Something went wrong!",
  //             });
  //         }

  //         // Extracting relevant details from each project
  //         const projects = userData.project.map(project => ({
  //             projectTitle: project.project_title,
  //             skills: project.skills,
  //             projectLink: project.project_link,
  //         }));

  //         res.status(200).send({
  //             data: {
  //                 projects: projects,
  //             },
  //             message: "Here are your projects",
  //         });
  //     } catch (error) {
  //         console.log(error);
  //         return res.status(500).send({
  //             data: {},
  //             message: error.message,
  //         });
  //     }
  // }

  // async test(req, res) {
  //   console.log(req.body);
  //   console.log(req.user.id);
  // }
}

module.exports = new profileController();
