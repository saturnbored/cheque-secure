const db_model = require('../../db/db_model.js')
const decrypt = require("../../utilities/decrypt");
const encrypt = require("../../utilities/encrypt");
const bcrypt = require('bcrypt');
const jwtHelper = require("../auth/jwt.js");

function checkUsername(username) {
    return new Promise(resolve => {
        db_model.adminModel.findOne({ username: username }, (err, admin) => {
            if (err) throw err;
            if (admin != null) {
                resolve(admin);
            }
            resolve(admin);
        })
    })
}

// async function adminLogin2(req, res){
//     const privatekey = `-----BEGIN ENCRYPTED PRIVATE KEY-----
// ${process.env.PRIVATE_KEY}
// -----END ENCRYPTED PRIVATE KEY-----`
//     const decrytedString = endcrypt.decryptStringWithRsaPrivateKey2(req.body.object, privatekey)
//     const credentials =json.parse(decrytedString);
//     // console.log(credentials);
//     const admin = await checkUsername(credentials.username);
//     if(!admin){
//         bcrypt.compare(credentials.password,admin.password, (err,result)=>{
//             if(err) throw err;
//             if(result){
//                 res.json({username :admin.username});
//             }else{
//                 res.send(401);
//             }
//         })
//     }
// }

async function adminLogin(req, res) {
    const credentials = JSON.parse(await decrypt.decrypt(req.body.obj))
    console.log(credentials);
    const admin = await checkUsername(credentials.username);
    if (admin!=null) {
        const encrypted_aes_key =await  encrypt.encryptWithClientPublicKey(process.env.AES_KEY, req.body.public_key)
        bcrypt.compare(credentials.password, admin.password, (err, result) => {
            if (err) throw err;
            if (result) {
                const user={ username: admin.username,encrypted_aes_key: encrypted_aes_key };
                const accessToken = jwtHelper.generateAccessToken(user)
                res.json({ username: admin.username, encrypted_aes_key: encrypted_aes_key, accessToken:accessToken});

            } else {
                res.send(401);
            }
        })
    } else {
        res.send(401);
    }
}




module.exports = {
    adminLogin,
}