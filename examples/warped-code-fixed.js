'use strict';

var RSVP = require('rsvp');
var xhr = require('superagent');
var ENDPOINT = '/api/endpoint';

module.exports = function (data) {
  return new RSVP.promise(function (resolve, reject) {
    xhr
      .post(ENDPOINT)
      .send(data)
      .end(function (err, res) {
        if (err) {
          return reject(err);
        }

        if (res.body.errors) {
          return resolve({ errors: res.body.errors });
        }

        resolve({
          public_id: res.body.public_id
          merchant_public_id: res.body.merchant_public_id
        });
      }
  });
};
