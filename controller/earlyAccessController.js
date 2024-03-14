const earlyAccessModel = require("../model/earlyAccessModel.js");

class earlyAccessController {
  earlyAccessController() {}

  async collectData(req, res) {
    //FULL NAME NOT PRESENT
    try {
      if (
        req.body.full_name === "" ||
        req.body.full_name === null ||
        req.body.full_name === undefined
      ) {
        return res.status(201).send({
          data: {},
          message: "Full Name is absent!",
        });
      }

      //EMAIL IS NOT PRESENT
      if (
        req.body.email === "" ||
        req.body.email === null ||
        req.body.email === undefined
      ) {
        return res.status(201).send({
          data: {},
          message: "Email is absent!",
        });
      }

      //EMAIL ALREADY RECORDED FOR EARLY ACCESS
      let existingUser = await earlyAccessModel.findOne({
        email: req.body.email,
      });
      //   console.log(existingUser);
      if (existingUser && Object.keys(existingUser).length > 0) {
        return res.status(201).send({
          data: {},
          message: "Email has already been recorded!",
        });
      }
      //   console.log(req.body);
      const data = req.body;
      //   console.log(data);
      let newData = await new earlyAccessModel(data).save();

      if (Object.keys(newData).length === 0) {
        return res.status(201).send({
          data: {},
          message: "Something went wrong!",
        });
      }

      return res.status(200).send({
        data: newData,
        message: "Email has been recorded!",
      });
    } catch (error) {
      return res.status(500).send({
        data: {},
        message: error.message,
      });
    }
  }
}

module.exports = new earlyAccessController();
