const db_model = require('../../db/db_model.js')


function getPendingCheque() {
    return new Promise(resolve => {
        db_model.chequeModel.find({ chequeStatus: 2 }, (err, cheques) => {
            if (err) throw err;
            resolve(cheques);
        })
    })
}

async function adminDashboard(req, res) {
    const chequesArray= await getPendingCheque();
    let cheque_ids=[]
    for(var i=0;i<chequesArray.length;i++) {
        cheque_ids.push(chequesArray[i]._id)
    }
    res.json(cheque_ids);
}

// async function verifyCheque(req,res){

// }

module.exports={
    adminDashboard
}
