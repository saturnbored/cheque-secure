const db_model = require("../../db/db_model.js");
const aesEncandDec = require("../../utilities/encrypt&DecryptAes.js");
const decrypt = require("../../utilities/decrypt.js");
const ab2str = require("../../utilities/arrayBufferToString");
const str2ab = require("../../utilities/stringToArrayBuffer");
const fs = require("fs");
const axios = require("axios");

function CountDocuments(username) {
  return new Promise((resolve) => {
    db_model.customerModel.findOne({ username: username }, (err, customer) => {
      if (err) throw err;
      resolve(customer.chequeIdArray.length);
    });
  });
}

function AddChequeToCustomer(username, chequeId) {
  return new Promise((resolve) => {
    db_model.customerModel.findOneAndUpdate(
      { username: username },
      { $push: { chequeIdArray: chequeId } },
      function (error, success) {
        if (error) {
          throw err;
        } else {
          //console.log(success);
          resolve(success);
        }
      }
    );
  });
}

// function removeMICRCode(username, code) {
//     return new Promise(resolve => {
//         db_model.userDetailsModel.findOneAndUpdate(
//             { username: username },
//             { $pull: { chequeCodeArray :code } },
//             function (error, success) {
//                 if (error) {
//                     console.log(error);
//                     resolve(error);
//                 } else {
//                     //console.log(success);
//                     resolve(success);
//                 }
//             });

//     });
// }

function checkMICRCode(micr) {
  return new Promise((resolve) => {
    db_model.chequeModel.findOne({ chequeCode: micr }, (err, result) => {
      if (err) throw err;
      if (result != null) resolve(true);
      resolve(false);
    });
  });
}

function _base64ToArrayBuffer(base64) {
  return new Promise((resolve) => {
    var binary_string = atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    resolve(bytes.buffer);
  });
}

function retriveACno(username){
    return new Promise(resolve=>{
      db_model.customerModel.findOne({username:username},(err, result)=>{
        if(err) throw err;
        resolve(result.accountNumber);
      })
    })
}

async function depostCheque(req, response) {
  let arrayBase64 = [];
  let encryptedImages = [];
  //console.log(req.body.images[0])
  for (var i = 0; i < req.body.images.length; i++) {
    encryptedImages.push(req.body.images[i])
    const a = await _base64ToArrayBuffer(req.body.images[i]);
    //console.log("required encryption:", a)
    const b = await aesEncandDec.decryptMessage(a);
    const ans = ab2str.ab2str(b);
    arrayBase64.push(ans);
    //console.log(ans)
  }

  var micr;
  var rs;
  axios
    .post("https://pramocr.herokuapp.com/secret/ocr", {
      image: arrayBase64[0],
    })
    .then(async (res) => {
      console.log(res.data);
      if (res.data == null) {
        micr = -1;
      }
      if (micr != -1) {
        micr = res.data.transit + res.data.institution + res.data.account;
      }
      console.log(micr);

      if (micr == -1) {
        response.json("Cheque images are not good");
        //rs=-1;
      } else if (await checkMICRCode(micr)) {
        response.json("Cheque has already been deposited");
        rs = 0;
      } else {
        const obj = JSON.parse(await decrypt.decrypt(req.body.obj));
        console.log(obj);
        const ACnumber = await retriveACno(obj.username);
        const id = obj.username + "@" + (await CountDocuments(obj.username));
        const cheque = new db_model.chequeModel({
          username: obj.username,
          senderAccountNumber:ACnumber,
          chequeCode: micr,
          chequePhotographs: encryptedImages,
          senderAccountNo: obj.account_number,
          _id: id,
        });
        cheque.save((err) => {
          if (err) throw err;
          console.log("Cheque saved to database successfully");
        });
        await AddChequeToCustomer(obj.username, id);
        response.json("Cheque deposited successfully");
        rs = 1;
      }
    })
    .catch((err) => console.log(err));

  console.log("Final result ", rs);
}

module.exports = {
  depostCheque,
};
