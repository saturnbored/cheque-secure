const express = require('express')
const https = require('https');
const multer = require('multer');
const axios = require('axios');
var cors = require('cors')


var fs = require('fs'),
  chequeOCR = require('../index');

const app = express()

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors())
const upload = multer()

// var image = fs.readFileSync('./test/fixtures/sample_cibc.jpg');

function convertToImage(base64) {
  return new Promise(resolve => {
          // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
          var bitmap = Buffer.from(base64, 'base64');
          // write buffer to file
          resolve(bitmap)
  })
}



app.post('/secret/ocr', upload.any(), async (req, res) => {

  // var image = fs.readFileSync('./test/fixtures/sample_cibc.jpg');
  console.log("Attempting to OCR a sample cheque image...");
  var img = await convertToImage(req.body.image);
  console.log(img)
 // console.log(req.files)
  chequeOCR(img, function (err, result) {
    if (err) {
      console.warn("Something went wrong:");
      console.warn(err);
      res.json(null)
    } else {
      console.log("Results:");
      console.log(JSON.stringify(result, null, 4));
      res.json(result.numbers)
    }
  });
})

const port  = process.env.PORT || 9000
app.listen(port, (err) => {
  if (err) throw err;
  console.log("OCR Server started successfully")
})