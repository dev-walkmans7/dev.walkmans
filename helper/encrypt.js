const CryptoJS = require("crypto-js");
const encryptKey = (text) => {
  const buffer = Buffer.from(text, "utf-8");
  return buffer.toString("base64");
};

const encryptionFunction = (text, key) => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(text), key).toString();
  return encrypted;
};

const decryptionFunction = (text, key) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(text, key).toString(
      CryptoJS.enc.Utf8
    );
    // console.log(decrypted);
    return decrypted;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { encryptKey, encryptionFunction, decryptionFunction };
