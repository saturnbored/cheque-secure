const mongoose = require('mongoose')

const schemas=require('../db_schemas/db_schemas.js')

//const mongoURL="mongodb://localhost:27017/ChequeDB"

const mongoPassword= process.env.MONGO_PASSWORD || "12345678";

console.log(mongoPassword)

const mongoURL= process.env.MONGO_URI;

function connectWithDatabase(){
    mongoose.connect(mongoURL,{useNewUrlParser:true},(err, res)=>{
        if(err) {
            console.log("Error in connecting with MongoDB database")
            console.log(err);
        }

        console.log(mongoURL);
        console.log("Connected with MongoDB database")
    })
}

const adminModel=mongoose.model("AdminSchema",schemas.adminSchema)
const customerModel=mongoose.model("CustomerSchema",schemas.customerSchema)
const chequeModel=mongoose.model("ChequeSchema",schemas.chequeSchema)
const userDetailsModel=mongoose.model("UserDetails",schemas.userDetailsSchema)

    




module.exports={
    connectWithDatabase,
    adminModel,
    customerModel,
    chequeModel,
    userDetailsModel
}