const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel.js");
const { decryptionFunction, encryptKey } = require("../helper/encrypt.js");
const config = require("../config/config.js");

const requireSignIn = (req, res, next) => {
  try {
    const token = JSON.parse(
      decryptionFunction(
        req.headers["authorization"],
        encryptKey(process.env.Token_Encryption_Key)
      )
    );
    // const token = req.headers["authorization"];
    const decode = jwt.verify(token, config.jwtSecret);
    // console.log(decode);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(500).send({
      message: "Invalid Token",
    });
  }
};

module.exports = { requireSignIn };
