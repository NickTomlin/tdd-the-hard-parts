'use strict';

var RSVP = require('rsvp');
var xhr = require('superagent');
var ENDPOINT = '/api/endpoint';

function create(data) {
  var deferred = RSVP.defer();

  xhr
    .post(ENDPOINT)
    .send(data)
    .end(function (err, res) {
      if (err) {
        return deferred.reject(err);
      }

      _handleCreateSignup(deferred, res);
    });

  return deferred.promise;
}

function _handleCreateSignup(deferred, res) {
  if (res.body.errors) {
    return deferred.resolve({ errors: res.body.errors });
  }

  deferred.resolve({
    public_id: res.body.public_id
    merchant_public_id: res.body.merchant_public_id
  });
}

module.exports = {
  _handleCreateSignup: _handleCreateSignup,
  create: create,
};
