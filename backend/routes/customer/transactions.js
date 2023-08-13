const db_model = require('../../db/db_model.js')

function getChequeIdArray(username) {
    return new Promise(resolve => {
        db_model.customerModel.findOne({ username: username }, (err, customer) => {
            if (err) throw err;
            console.log("Results: ", customer.chequeIdArray)
            resolve(customer.chequeIdArray);
        })
    })
}
function getStatus(chequeId) {
    return new Promise(resolve => {
        db_model.chequeModel.findOne({ _id: chequeId }, (err, cheque) => {
            if (err) throw err;
            console.log("CHEQUE_iD: ",cheque.chequeStatus);
            if(cheque!=null)
            resolve(cheque.chequeStatus);
            else resolve(null)
        })
        
    })
}
async function transactions(req, res) {
    const username = req.query.username;
    console.log(username);
    var chequeArray=[]
    const chequeIdArray = await getChequeIdArray(username);
    
    for (let i = 0; i < chequeIdArray.length;i++) {
        console.log(chequeIdArray[i]);
        const chequeStatus = await getStatus(chequeIdArray[i]);
        const obj = {
            _id: chequeIdArray[i],
            chequeStatus: chequeStatus
        }
        chequeArray.push(obj);
    }
    // console.log(chequeArray);
    res.json(chequeArray);
}

function getCheque(_id) {
    return new Promise(resolve => {
        db_model.chequeModel.findOne({ _id: _id }, (err, cheque) => {
            if (err) throw err;
            resolve(cheque.chequePhotographs);
        })
    })
}

async function transactionDetail(req, res) {
    const chequePhotographs = await getCheque(req.query._id);
    res.json({chequePhotographs: chequePhotographs});
}

module.exports = {
    transactions,
    transactionDetail,
}