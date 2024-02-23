const CryptoJS = require("crypto-js");
const fs = require("fs");
// const Buffer = require("buffer");

// // const encrypted = CryptoJS.AES.encrypt(data, secretKey).toString();
// // console.log('Encrypted:', encrypted);

// Decrypt the encrypted data
// var encryptedString =
//   "U2FsdGVkX1+8+omJWvxJF7bg6Dawt/+ClqGzq2qldcO4TrcNBWMh70eSPC5AHw6j";
// const decrypted = CryptoJS.AES.decrypt(
//   encryptedString,
//   "uK14fE0M6VbcE2@M&0cXqWz"
// ).toString(CryptoJS.enc.Utf8);
// console.log(decrypted);
// const data = "uK14fE0M6VbcE2@M&0cXqWz";
// const encryptKey = (text) => {
//   const buffer = Buffer.from(text, "utf-8");
//   return buffer.toString("base64");
// };

// const timestamp = new Date();
// console.log(timestamp);

// let encrypted = CryptoJS.AES.encrypt(
//   JSON.stringify(timestamp),
//   encryptKey(data)
// ).toString();
// console.log("2 log", encrypted);

// // var encryptedString = encrypted;
// const decrypted = CryptoJS.AES.decrypt(encrypted, encryptKey(data)).toString(
//   CryptoJS.enc.Utf8
// );
// console.log("3 log", JSON.parse(decrypted));

// // const dateObject = new Date(decrypted);
// // console.log("Decrypted:", dateObject.getTime());
// // console.log(typeof decrypted);
// // console.log(typeof Date.parse(decrypted));

// // const originalDateTimeString = decrypted;
// // const targetDateTimeString = "2023-12-25T12:00:00";
// // const originalDate = new Date(originalDateTimeString);
// // const targetDate = new Date(targetDateTimeString);
// // originalDate.setHours(
// //   targetDate.getHours(),
// //   targetDate.getMinutes(),
// //   targetDate.getSeconds(),
// //   targetDate.getMilliseconds()
// // );
// const Date = new Date();
// console.log(Date);
// // const convertedDateTimeString = originalDate.toISOString();

// // console.log(convertedDateTimeString);

// const date = new Date();
// console.log(date);
// const originalDateTimeString = decrypted;
// const d = new Date(JSON.parse(decrypted));
// console.log(d);

// const loadModel = () => {
//   try {
//     const model_data = fs.readFileSync("linear_regression_model.json", "utf8");
//     return JSON.parse(model_data);
//   } catch (err) {
//     console.error("Error loading the model:", err);
//     return null;
//   }
// };

// const makePredictions = (inputData, modelParams) => {
//   const coefficients = modelParams.coefficients;
//   const intercept = modelParams.intercept;

//   // Assuming inputData is an array of arrays, each inner array representing a data point
//   const predictions = inputData.map((dataPoint) => {
//     const prediction = dataPoint.reduce((acc, value, index) => {
//       return acc + value * coefficients[index];
//     }, intercept);
//     return prediction;
//   });

//   return predictions;
// };

// const inputData = [
//   [0.520575],
//   [0.518522],
//   [0.495094],
//   [0.53624],
//   [0.524468],
//   [0.516204],
//   [0.046799],
//   [0.038686],
//   [0.097376],
//   [0.033274],
//   [0.401197],
// ];
// const modelParams = loadModel();
// if (modelParams) {
//   const predictions = makePredictions(inputData, modelParams);
//   console.log("Predictions:", predictions);
// }
// let encrypted = CryptoJS.AES.encrypt(
//   JSON.stringify(timestamp),
//   encryptKey(data)
// ).toString();
// console.log("Log", encrypted);

// let encryptedText = CryptoJS.AES.encrypt(
//   "Hi",
//   "uYef8kmdy28vnsdie$dmcmwsbxt2"
// ).toString();
// console.log(encryptedText);

// let decryptedText = CryptoJS.AES.decrypt(
//   encryptedText,
//   "uYef8kmdy28vnsdie$dmcmwsbxt2"
// ).toString(CryptoJS.enc.Utf8);
// console.log(decryptedText);
// const a = { title: "hi", no: 3 };
// let b = [
//   { title: "hello", no: 1 },
//   { title: "hola", no: 2 },
// ];
// b = [...b, a];
// console.log(b);
// U2FsdGVkX1+YEkYEV7UVpHacv2CSTsSguPW/zzbta83kHMDRQ29UAP3OEmZBDBiI

// const CryptoJS = require("crypto-js");
const encryptKey = (text) => {
  const buffer = Buffer.from(text, "utf-8");
  return buffer.toString("base64");
};

// const encryptionFunction = (text, key) => {
//   const encrypted = CryptoJS.AES.encrypt(JSON.stringify(text), key).toString();
//   return encrypted;
// };

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

// console.log(
//   decryptionFunction(
//     "U2FsdGVkX1+YEkYEV7UVpHacv2CSTsSguPW/zzbta83kHMDRQ29UAP3OEmZBDBiI",
//     encryptKey("uK14fE0M6VbcE@2M0cXqWz")
//   )
// );
let decryted = decryptionFunction(
  "U2FsdGVkX1+YEkYEV7UVpHacv2CSTsSguPW/zzbta83kHMDRQ29UAP3OEmZBDBiI",
  encryptKey("uK14fE0M6VbcE@2M0cXqWz")
);

const timestamp = new Date();
// console.log(timestamp)
// const encryptKey = (text) => {
//   const buffer = Buffer.from(text, "utf-8");
//   return buffer.toString("base64");
// };

const key = "uK14fE0M6VbcE@2M0cXqWz";
console.log("Key", encryptKey(key));
console.log("Timestamp", decryted);
// console.log(typeof timestamp);
let encrypted = CryptoJS.AES.encrypt(
  JSON.stringify(decryted),
  encryptKey(key)
).toString();
console.log(encrypted);
