function containsCat(array) {
  _parseArgument(array)
  return _checkArray(array);
}

function _checkForCat(input) {
  return /cat/.test(input);
}

function _checkArray(array, test) {
  return array.some(test);
}

function _parseArgument(args) {
  if ('[object Array]' !== Object.prototype.toStrng.call(args)) {
    throw new Error('Arguments must be an array');
  }
}

module.exports = {
  containsCat: containsCat,
  _checkForCat: _checkForCat,
  _checkArray: _checkArray,
  _parseArgument: _parseArgument
};
