'use strict';
exports.censor = function(obj, censorKeyArray) {
  censorKeyArray.forEach(function(key){
    //split with dot notation
    var keyArray = key.split('.');
    if (keyArray.length >= 1) {
      // this mean the key exist
      var targetKey = keyArray[0];
      if (typeof obj[targetKey] !== 'undefined') {
        obj[targetKey] = _censorDeep(obj[targetKey], keyArray.splice(1, keyArray.length));
      }
    }
  });
};

var _censorDeep = function(obj, censorKeyArray) {
  if (censorKeyArray.length === 0 && typeof obj !== 'undefined') {
    // this means function reach its base condition, return censor
    return '**CENSORED**';
  }
  var targetKey = censorKeyArray[0];
  if (obj instanceof Object && obj[targetKey] !== 'undefined') {
    obj[targetKey] = _censorDeep(obj[targetKey], censorKeyArray.splice(1, censorKeyArray.length));
    return obj;
  }
  return obj;
};

var _checkPath = function(path, req) {
  if (req.route && req.route.path) {
    return path === req.route.path
  }
  return path === req.path
}

var _checkMethod = function(method, req) {
  if (typeof method === 'undefined') {
    return true
  }
  return method === req.method
}

exports.shouldSkip = function(skips, req) {
  for (var i = skips.length - 1; i >= 0; i--) {
    if (_checkPath(skips[i].path, req) && _checkMethod(skips[i].method, req)) {
      return true
    }
  }
  return false
}

exports._censorDeep = _censorDeep;
