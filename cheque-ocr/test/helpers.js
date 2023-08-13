var fs = require('fs'),
    chai = require('chai'),
    chequeOCR = require('../index');

global.chequeOCR = chequeOCR;
global.expect = chai.expect;

global.readFixture = function(filename) {
  return fs.readFileSync('./test/fixtures/' + filename);
};
