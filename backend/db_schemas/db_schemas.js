const { Schema } = require('mongoose')

const imageSchema = new Schema({
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    buffer: Buffer,
    size: Number
})


const adminSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const customerSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    ifscCode: {
        type: String,
        required: true
    },
    chequeIdArray: [String]
})

const chequeSchema = new Schema({
    date: {
        type: String, // DD/MM/YYYY format
        required: false
    },
    amount: {
        type: Number,
        required: false
    },
    senderAccountNumber:{
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    recipientName: {
        type: String,
        required: false
    },
    chequeCode: {
        type: String,
        required: false
    },
    // senderAccountNo: {
    //     type: String,
    //     required: false
    // },
    recipientAccountNo: {
        type: String,
        required: false
    },
    chequePhotographs: {
        type: [String],
        required: true
    },
    _id: {                   // id format==username@count
        type: String,
        required: true
    },
    chequeStatus: {
        type: Number, // 0== failed, 1==success, 2==Pending
        required: true,
        default:2
    }

})

const userDetailsSchema = new Schema({
    _id: {              // represents account number of a user
        type: String,
        required: true
    },
    accountHolderName: {
        type: String,
        required: true
    },
    accountHolderPhoneNo: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    accountHolderSignature: {
       type:imageSchema,
    },
    ifscCode: {
        type: String,
        required: true
    },
    chequeCodeArray: [String]
})


module.exports = {
    adminSchema,
    customerSchema,
    chequeSchema,
    userDetailsSchema,
    imageSchema
}