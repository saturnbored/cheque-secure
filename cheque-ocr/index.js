var Tesseract = require('tesseract.js'),
    named = require('named-regexp').named,
    _ = require('underscore');

var LANGUAGE_CODE = 'micr';
var MICR_CHARACTERS = '0123456789abcd';
var SYMBOL_CONFIDENCE_THRESHOLD_PERCENT = 45;
var CANADIAN_CHEQUE_REGEX = named(/[0-9]+ca(:<transit>[0-9]{4,5})d(:<institution>[0-9]{3})a(:<account>[dc0-9]+)/);

function getConfidentSymbols(words) {
  return _.flatten(words.map(function(word) {
    return word.symbols;
  })).filter(function(symbol) {
    return symbol.confidence > SYMBOL_CONFIDENCE_THRESHOLD_PERCENT;
  });
}

function removeNonNumericSymbols(text) {
  return text.replace(/\D/g,'');
}

module.exports = function(image, callback) {
  Tesseract.recognize(image, {
    lang: LANGUAGE_CODE,
    tessedit_char_whitelist: MICR_CHARACTERS,
  }).then(function(result){
    var text = result.text;
    var response = {
      rawText: text,
    };

    if (result.blocks.length === 0 || result.blocks[0].lines.length === 0) {
      return callback({error: "NO_TEXT_BLOCKS_FOUND"}, response);
    }

    var lines = result.blocks[0].lines;
    var chequeLineWords = lines[lines.length - 1].words;
    var confidentSymbols = getConfidentSymbols(chequeLineWords);
    var averageConfidence = confidentSymbols.reduce(function(value, symbol) { return value + symbol.confidence; }, 0) / confidentSymbols.length;
    var parsedChequeLine = confidentSymbols.map(function(symbol) { return symbol.text; }).join("");

    var chequeMatches = CANADIAN_CHEQUE_REGEX.exec(parsedChequeLine);

    if (!chequeMatches) {
      return callback({error: "NO_CHEQUE_NUMBERS_FOUND"}, response);
    }

    response.confidence = averageConfidence;
    response.numbers = {
      transit: removeNonNumericSymbols(chequeMatches.capture('transit')),
      institution: removeNonNumericSymbols(chequeMatches.capture('institution')),
      account: removeNonNumericSymbols(chequeMatches.capture('account')),
    };

    callback(null, response);
  });
};
