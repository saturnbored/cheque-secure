// External Packages
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
// Custom packages

const db_model = require("./db/db_model.js");
const saveUserDetail = require("./routes/admin/userDetails.js");
const adminLogin = require("./routes/admin/adminLogin.js");
const ad_details = require("./routes/admin/getDetails.js");
const detailCheque = require("./routes/admin/detailCheque.js");
const profile = require("./routes/customer/profile.js");
const signupAndLogin = require("./routes/customer/signupAndLogin.js");
const checkUsernameExists = require("./routes/customer/signupAndLogin.js");
const transactions = require("./routes/customer/transactions.js");
const cheque = require("./routes/customer/depositCheque.js");
const decrypt = require("./utilities/decrypt");
const aesEncy = require("./utilities/encrypt&DecryptAes.js");
const jwtHelper = require("./routes/auth/jwt.js");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
const upload = multer();

//console.log(process.env.PUBLIC_KEY.replace(/\\n/g, '\n'))
db_model.connectWithDatabase();

//const enc=aesEncy.encryptMessage(obj)
//aesEncy.decryptMessage(enc)
//aesEncy.all()

app.get("/api/getPublicKey", (req, res) => {
  // process.env.PUBLIC_KEY
  const key = process.env.PUBLIC_KEY.replace("-----BEGIN PUBLIC KEY-----", "")
    .replace("-----END PUBLIC KEY-----", "")
    .replace(/\n/g, "");
    
  console.log("Returning public key", key);
  res.json(key);
});

app.get("/api/checkAccountNumber", (req, res) => {
  signupAndLogin.checkAccountNumber(req, res);
});

app.post("/api/userDetails", upload.any(), (req, res) => {
  saveUserDetail.saveUserDetail(req, res);
});

app.post(
  "/api/depositCheque",
  jwtHelper.authenticateToken,
  upload.any(),
  (req, res) => {
    // console.log(req.body);
    cheque.depostCheque(req, res);
  }
);

app.post("/api/adminLogin", (req, res) => {
  adminLogin.adminLogin(req, res);
});

app.post("/api/admin", (req, res) => {
  saveUserDetail.createAdmin(req, res);
});

app.get("/api/adminDashboard", jwtHelper.authenticateToken, (req, res) => {
  ad_details.adminDashboard(req, res);
});

app.post("/api/signUp", (req, res) => {
  signupAndLogin.signUp(req, res);
});

app.post("/api/login", (req, res) => {
  signupAndLogin.logIn(req, res);
});

app.get("/api/transactions", jwtHelper.authenticateToken, (req, res) => {
  // console.log("Hello");
  transactions.transactions(req, res);
});

app.get("/api/transactionDetail", jwtHelper.authenticateToken, (req, res) => {
  transactions.transactionDetail(req, res);
});

app.get("/api/profile", jwtHelper.authenticateToken, (req, res) => {
  profile.profile(req, res);
});

app.get("/api/checkUsernameExists", (req, res) => {
  checkUsernameExists.checkUsernameExists(req, res);
});

app.post("/api/captchaVerification", async (req, res) => {
  console.log(process.env.CAPTCHA_SECRET_KEY);

  const verifyCaptcha = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    null,
    {
      params: {
        secret: process.env.CAPTCHA_SECRET_KEY,
        response: req.body.token,
      },
    }
  );
  console.log(verifyCaptcha.data);
  res.send(verifyCaptcha.data);
});

app.get("/api/detailedCheque", jwtHelper.authenticateToken, (req, res) => {
  detailCheque.detailCheque(req, res);
});
app.get("/api/recipientName", jwtHelper.authenticateToken, (req, res) => {
  detailCheque.recipientName(req, res);
});

app.post("/api/verifyCheque", jwtHelper.authenticateToken, (req, res) => {
  detailCheque.verifyCheque(req, res);
});

// app.post("/abc", upload.any(),(req, res) => {
//     const f = req.files[0]
//     aesEncy.all(f.buffer)
// })

app.listen(8080, () => {
  console.log("Pram Server is running on port 8080");
});
