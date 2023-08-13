const db_model=require('../../db/db_model.js')

function getUserDetail(username){
    return new Promise(resolve=>{
        db_model.customerModel.findOne({username:username},(err,result)=>{
            if(err) return err;
            const obj ={
                accountNumber: result.accountNumber,
                ifscCode: result.ifscCode,
                mobileNumber: result.mobileNumber,
            }
            resolve(obj)
        })
    })
}

async function profile(req, res){
    const object = await getUserDetail(req.query.username);
    res.json(object);
}

module.exports={
    profile
}