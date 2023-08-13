var fs = require('fs'),
    chequeOCR = require('../index');

var images = {
  CIBC: fs.readFileSync('./test/fixtures/sample_cibc.jpg'),
  SAMPLE: fs.readFileSync('./test/fixtures/sample_cheque.jpg'),
  INVALID_NO_TEXT: fs.readFileSync('./test/fixtures/invalid_no_text.png'),
  INVALID_MISSING_NUMBERS: fs.readFileSync('./test/fixtures/invalid_missing_numbers.jpg'),
  INVALID_PARTIAL_NUMBERS: fs.readFileSync('./test/fixtures/invalid_partial_numbers.jpg'),
};

for (var file in images) {
  var image = images[file];
  chequeOCR(image, function(err, result) {
    if (err) {
      console.warn("Sample invalid image:");
      console.warn(err, result);
    } else {
      console.log("Sample valid image:");
      console.log(result);
    }
  });
}
