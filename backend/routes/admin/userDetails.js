const db_model=require('../../db/db_model.js')
const bcrypt = require("bcrypt");
const saltRounds = 10;

function checkInDb(accountNumber){
    return new Promise(resolve=>{
        db_model.userDetailsModel.findOne({_id:accountNumber},(err,result)=>{
            if(err) throw err;
            if(result !=null){
                resolve(true);
            }
            resolve(false);
        })
    })
}

function checkAdmin(username){
    return new Promise(resolve => {
        db_model.adminModel.findOne({username:username},(err,result)=>{
            if(err) throw err;
            if(result!=null){
                resolve(true);
            }
            resolve(false);
        })
    })
}

async function saveUserDetail(req,res){
    const isfind =await checkInDb(req.body.accountNumber);
    if(!isfind){
        //console.log(req.body,req.files)
        const userDetail =new db_model.userDetailsModel({
            _id: req.body.accountNumber,
            accountHolderName: req.body.accountHolderName,
            accountHolderPhoneNo:req.body.accountHolderPhoneNo,
            balance: req.body.balance,
            accountHolderSignature: req.files[0],
            ifscCode: req.body.ifscCode,
            chequeCodeArray: req.body.chequeCodeArray,
        })
        userDetail.save((err)=>{
            //console.log(userDetail.accountHolderSignature.buffer)
            if(err) throw err;
            //console.log("Saved Successfully");
        })
        res.json("Saved Successfully")
    }else{
        console.log("This user already exists")
        res.json("This user already exists")
    }
}
async function createAdmin(req,res){
        const isFind = await checkAdmin(req.body.username);
        if(!isFind){
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if (err) throw err;
                    const admin =new db_model.adminModel({
                        username:req.body.username,
                        password:hash
                    })
                    admin.save((err) => {
                        if (err) throw err
                    })
                    res.json(true)
                })
            })
        }else{
            res.json(false)
        }
}

module.exports={
    saveUserDetail,
    createAdmin
}