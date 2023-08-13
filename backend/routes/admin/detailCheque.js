const db_model = require("../../db/db_model.js");
const decrypt = require("../../utilities/decrypt");

function getSenderSigature(_id) {
  return new Promise((resolve) => {
    db_model.userDetailsModel.findOne({ _id: _id }, (err, result) => {
      if (err) throw err;
      console.log(result);
      resolve(result.accountHolderSignature.buffer);
    });
  });
}
function getFileArrayAndAccountNum(cheque_id) {
  return new Promise((resolve) => {
    db_model.chequeModel.findOne({ _id: cheque_id }, (err, result) => {
      if (err) throw err;
      resolve({
        chequePhoto: result.chequePhotographs,
        senderAccountNo: result.senderAccountNumber,
        chequeCode: result.chequeCode,
      });
    });
  });
}

async function detailCheque(req, res) {
  const obj = await getFileArrayAndAccountNum(req.query.cheque_id);
  const acNo = obj.senderAccountNo;
  const signatureImagebuffer = await getSenderSigature(acNo);
  const signatureImagebase64 = signatureImagebuffer.toString("base64");
  const photo = obj.chequePhoto;
  const chequeCode = obj.chequeCode;
  res.json({
    signatureImagebase64,
    photo,
    chequeCode,
    acNo,
  });
}
function getrecipientName(account_number) {
  return new Promise((resolve) => {
    db_model.userDetailsModel.findOne(
      { _id: account_number },
      (err, result) => {
        if (err) throw err;
        // console.log(result);accountHolderName
        if(result==null) resolve(null);
        else {resolve(result.accountHolderName);}
      }
    );
    // resolve(null);
  });
}

async function recipientName(req, res) {
  const name = await getrecipientName(req.query.recipientAccountNo);
  if(name==null) {res.json("Invalid Account Number"); return;}
  res.json({ recipientName: name });
}

function getSenderAccountNoAndAmount(_id) {
  return new Promise((resolve) => {
    db_model.chequeModel.findOne({ _id: _id }, (err, cheque) => {
      if (err) throw err;
      // resolve(cheque.senderAccountNo);
      db_model.userDetailsModel.findOne(
        { _id: cheque.senderAccountNumber },
        (err, result) => {
          if (err) throw err;
          resolve({
            senderAccountNo: cheque.senderAccountNumber,
            senderBalance: result.balance,
          });
        }
      );
    });
  });
}

function updateCheque(_id, amount, name, accountNumber, status) {
  return new Promise((resolve) => {
    const update = {
      amount: amount,
      recipientName: name,
      recipientAccountNo: accountNumber,
      chequeStatus: status,
    };
    db_model.chequeModel.findOneAndUpdate(
      { _id: _id },
      { $set:  update  },
      (err, result) => {
        if (err) throw err;
        resolve(true);
      }
    );
  });
}
function changeStatus(_id, status) {
  return new Promise((resolve) => {
    db_model.chequeModel.findOneAndUpdate(
      { _id: _id },
      { $set: { chequeStatus: status } },
      (err, result) => {
        if (err) throw err;
        resolve(true);
      }
    );
  });
}

function removeCheque(accountNumber, chequeId) {
  return new Promise((resolve) => {
    db_model.customerModel.findOneAndUpdate(
      { accountNumber: accountNumber },
      { $pull: { chequeIdArray: chequeId } },
      (err, sender) => {
        if (err) throw err;
        resolve(true);
      }
    );
  });
}

function changeAmount(accountNumber, _amount) {
  console.log("acc no: ", accountNumber)
  return new Promise((resolve) => {
    db_model.userDetailsModel.findOneAndUpdate(
      { _id: accountNumber },
      { $inc: { balance: _amount } },
      (err, result) => {
        if (err) throw err;
        console.log("result: ", result.balance)
        resolve(true);
      }
    );
  });
}

async function verifyCheque(req, res) {
  const status = req.body.status;
  if (status == false) {
    await changeStatus(req.body._id, 0);
    res.json(false);
  } else {
    const decryptObject = JSON.parse(await decrypt.decrypt(req.body.object));
    // console.log(decryptObject.recipientAccountNo)
    const obj = await getSenderAccountNoAndAmount(req.body._id);
    if (obj.senderBalance < decryptObject.amount) {
      await changeStatus(req.body._id, 0);
      res.json(false);
      return
    }
    await updateCheque(
      req.body._id,
      decryptObject.amount,
      decryptObject.recipientName,
      decryptObject.recipientAccountNo,
      1
    );
    await changeAmount(decryptObject.recipientAccountNo, decryptObject.amount);
    await changeAmount(obj.senderAccountNo, -decryptObject.amount);
    // await removeCheque(obj.senderAccountNo, req.body._id);
    res.json(true);
  }
}

module.exports = {
  detailCheque,
  recipientName,
  verifyCheque,
};
