'use strict';

var signupHelper = require('../../../../lib/helpers/signup-helper');
var request = require('request');
var RSVP = require('rsvp');

describe('signupHelper', function () {
  var dataFromGatewayResponse, requestBody;

  beforeEach(function () {
    dataFromGatewayResponse = {
      public_id: 'publicId',
      merchant_public_id: 'merchantPublicId',
      country: 'GBR'
    };

    requestBody = {
      email: 'foo@bar.com',
      kountDeviceId: 'kount',
      paypalDeviceId: 'paypal'
    };
  });

  describe('create', function () {
    it('rejects if gateway response returns an error', function (done) {
      request.post = sinon.stub();
      var result = signupHelper.create({});
      var callback = request.post.lastCall.args[2];

      callback(new Error());

      result.catch(function (err) {
        expect(err).to.be.an.instanceOf(Error);
        done();
      });
    });
  });

  describe('_handleCreateSignup', function () {
    var mockDeferred;

    beforeEach(function () {
      mockDeferred = RSVP.defer();
      mockDeferred.resolve = sinon.spy();
      mockDeferred.reject = sinon.spy();
    });

    afterEach(function () {
      mockDeferred.resolve.reset();
      mockDeferred.reject.reset();
    });

    it('resolves with a redirect uri for the gateway', function () {
      signupHelper._handleCreateSignup(mockDeferred, {}, dataFromGatewayResponse);
      var result = mockDeferred.resolve.lastCall.args[0];
      expect(result.redirectURI).to.be.a('string');
    });

    it('resolves with a public id from the gateway', function () {
      signupHelper._handleCreateSignup(mockDeferred, {}, dataFromGatewayResponse);
      var result = mockDeferred.resolve.lastCall.args[0];
      expect(result.public_id).to.be.a('string');
    });

    it('resolves with a merchant id from the gateway', function () {
      signupHelper._handleCreateSignup(mockDeferred, {}, dataFromGatewayResponse);
      var result = mockDeferred.resolve.lastCall.args[0];
      expect(result.merchant_public_id).to.be.a('string');
    });

    it('rejects if response contains errors', function () {
      dataFromGatewayResponse.errors = {
        invalid: 'invalid'
      };

      signupHelper._handleCreateSignup(mockDeferred, {}, dataFromGatewayResponse);
      expect(mockDeferred.resolve.called).to.be.true;
      var result = mockDeferred.resolve.lastCall.args[0];
      expect(result.errors).to.have.property('invalid');
    });

    it('rejects if response from gateway has a non successful status', function () {
      signupHelper._handleCreateSignup(mockDeferred, {statusCode: 403}, dataFromGatewayResponse);
      var error = mockDeferred.reject.lastCall.args[0];

      expect(mockDeferred.reject.called).to.be.true;
      expect(error).to.be.an.instanceOf(Error);
      expect(error.status).to.eql('GatewayCreateError');
      expect(error.statusCode).to.eql(403);
    });
  });

});
