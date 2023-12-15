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
  const decrypted = CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
  return decrypted;
};

module.exports = { encryptKey, encryptionFunction, decryptionFunction };
